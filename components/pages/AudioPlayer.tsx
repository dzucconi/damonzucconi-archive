import { Box, Button, Cell, Stack, useThemer } from "@auspices/eos/client";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

const PEAK_RESOLUTION = 2048;

type PlayerState = {
  peaks: number[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};

type PlayerAction =
  | { type: "SET_PEAKS"; peaks: number[] }
  | { type: "SET_PLAYING"; isPlaying: boolean }
  | { type: "SET_CURRENT_TIME"; currentTime: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "ENDED" };

export type AudioPlayerProps = {
  trackId: string;
  src: string;
  title: string;
  isActive: boolean;
  shouldAutoplay: boolean;
  onActivate: (trackId: string) => void;
  onAutoplayHandled: (trackId: string) => void;
  onEnded: (trackId: string) => void;
};

const normalizePeaks = (values: number[]) => {
  const max = Math.max(...values, 1e-6);
  return values.map((value) => Math.max(0.04, value / max));
};

const getPeaksFromBuffer = (buffer: AudioBuffer, bars: number) => {
  const channelData = buffer.getChannelData(0);
  const samplesPerBar = Math.max(1, Math.floor(channelData.length / bars));
  const peaks = new Array(bars).fill(0);

  for (let i = 0; i < bars; i += 1) {
    const start = i * samplesPerBar;
    const end = i === bars - 1 ? channelData.length : start + samplesPerBar;
    let peak = 0;

    for (let j = start; j < end; j += 1) {
      peak = Math.max(peak, Math.abs(channelData[j] ?? 0));
    }

    peaks[i] = peak;
  }

  return normalizePeaks(peaks);
};

const getFallbackPeaks = (bars: number, seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  const peaks = new Array(bars).fill(0).map((_, i) => {
    const x = Math.sin((i + 1) * 12.9898 + hash * 0.001) * 43758.5453;
    const n = x - Math.floor(x);
    return 0.25 + n * 0.75;
  });

  return normalizePeaks(peaks);
};

const getAudioContext = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
};

const createPlayerInitialState = (src: string): PlayerState => ({
  peaks: getFallbackPeaks(PEAK_RESOLUTION, src),
  isPlaying: false,
  currentTime: 0,
  duration: 0,
});

const playerReducer = (
  state: PlayerState,
  action: PlayerAction,
): PlayerState => {
  switch (action.type) {
    case "SET_PEAKS":
      return { ...state, peaks: action.peaks };
    case "SET_PLAYING":
      return state.isPlaying === action.isPlaying
        ? state
        : { ...state, isPlaying: action.isPlaying };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.currentTime };
    case "SET_DURATION":
      return state.duration === action.duration
        ? state
        : { ...state, duration: action.duration };
    case "ENDED":
      return {
        ...state,
        isPlaying: false,
        currentTime: state.duration,
      };
    default:
      return state;
  }
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  trackId,
  src,
  title,
  isActive,
  shouldAutoplay,
  onActivate,
  onAutoplayHandled,
  onEnded,
}) => {
  const { theme } = useThemer();
  const playedColor = theme.colors.primary;
  const unplayedColor = theme.colors.secondary;
  const markerColor = theme.colors.primary;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, dispatch] = useReducer(
    playerReducer,
    src,
    createPlayerInitialState,
  );
  const { peaks, isPlaying, currentTime, duration } = state;

  useEffect(() => {
    if (isActive) {
      return;
    }

    const audio = audioRef.current;
    if (!audio || audio.paused) {
      return;
    }

    audio.pause();
  }, [isActive]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let frameId = 0;

    const update = () => {
      const audio = audioRef.current;
      if (audio) {
        dispatch({ type: "SET_CURRENT_TIME", currentTime: audio.currentTime });
      }
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!shouldAutoplay) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const play = async () => {
      if (audio.paused) {
        await audio.play().catch(() => undefined);
      }
      onAutoplayHandled(trackId);
    };

    play();
  }, [onAutoplayHandled, shouldAutoplay, trackId]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const loadPeaks = async () => {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch audio (${response.status})`);
        }

        const data = await response.arrayBuffer();
        const AudioContextCtor = getAudioContext();

        if (!AudioContextCtor) {
          throw new Error("AudioContext is not available");
        }

        const audioContext = new AudioContextCtor();

        try {
          const decoded = await audioContext.decodeAudioData(data.slice(0));

          if (cancelled) {
            return;
          }

          dispatch({
            type: "SET_PEAKS",
            peaks: getPeaksFromBuffer(decoded, PEAK_RESOLUTION),
          });
        } finally {
          await audioContext.close().catch(() => undefined);
        }
      } catch (error) {
        if (controller.signal.aborted || cancelled) {
          return;
        }

        dispatch({
          type: "SET_PEAKS",
          peaks: getFallbackPeaks(PEAK_RESOLUTION, src),
        });
      }
    };

    loadPeaks();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [src]);

  const progress = useMemo(() => {
    if (duration <= 0) {
      return 0;
    }

    return Math.max(0, Math.min(1, currentTime / duration));
  }, [currentTime, duration]);

  const visualProgress = isActive ? progress : 0;

  const drawPeaks = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const width = Math.max(1, Math.floor(canvas.clientWidth));
    const height = Math.max(1, Math.floor(canvas.clientHeight));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const progressX = Math.max(
      0,
      Math.min(width - 1, Math.floor(width * visualProgress)),
    );
    const peakMaxIndex = Math.max(0, peaks.length - 1);

    for (let x = 0; x < width; x += 1) {
      const index = Math.floor((x / Math.max(1, width - 1)) * peakMaxIndex);
      const amplitude = peaks[index] * (height * 0.48);
      const lineHeight = Math.max(1, Math.round(amplitude * 2));
      const y = Math.floor((height - lineHeight) / 2);

      ctx.fillStyle = x <= progressX ? playedColor : unplayedColor;
      ctx.fillRect(x, y, 1, lineHeight);
    }

    ctx.fillStyle = markerColor;
    ctx.fillRect(0, 0, 1, height);
  }, [markerColor, peaks, playedColor, unplayedColor, visualProgress]);

  useEffect(() => {
    drawPeaks();

    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => drawPeaks());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawPeaks]);

  const handleSeek = (event: MouseEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas || duration <= 0) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    audio.currentTime = ratio * duration;
    dispatch({ type: "SET_CURRENT_TIME", currentTime: audio.currentTime });

    if (!isPlaying) {
      onActivate(trackId);
      void audio.play().catch(() => undefined);
    }
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      onActivate(trackId);
      await audio.play().catch(() => undefined);
      return;
    }

    audio.pause();
  };

  return (
    <Box width={["100%", "100%", "75%", "50%"]} mx="auto">
      <Stack direction="horizontal">
        <Button
          onClick={togglePlayback}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          title={title}
          width={100}
        >
          {isPlaying ? <>Pause</> : <>Play</>}
        </Button>

        <Cell
          as="canvas"
          ref={canvasRef as any}
          onClick={(event) =>
            handleSeek(event as unknown as MouseEvent<HTMLCanvasElement>)
          }
          aria-label={`${title} waveform`}
          title={title}
          p={0}
          px={0}
          py={0}
          width="100%"
          height={50}
        />

        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onPlay={() => {
            dispatch({ type: "SET_PLAYING", isPlaying: true });
            onActivate(trackId);
          }}
          onPause={() => dispatch({ type: "SET_PLAYING", isPlaying: false })}
          onEnded={() => {
            dispatch({ type: "ENDED" });
            onEnded(trackId);
          }}
          onTimeUpdate={(event) =>
            dispatch({
              type: "SET_CURRENT_TIME",
              currentTime: event.currentTarget.currentTime,
            })
          }
          onLoadedMetadata={(event) =>
            dispatch({
              type: "SET_DURATION",
              duration: event.currentTarget.duration || 0,
            })
          }
        />
      </Stack>
    </Box>
  );
};
