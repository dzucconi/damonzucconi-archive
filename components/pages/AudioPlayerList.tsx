import { Stack, StackProps } from "@auspices/eos/client";
import React, { useCallback, useMemo, useReducer } from "react";
import { AudioPlayer } from "./AudioPlayer";

export type AudioTrack = {
  id: string;
  title?: string | null;
  url: string;
};

type AudioPlayerListProps = StackProps & {
  tracks: AudioTrack[];
};

const AUDIO_URL_PATTERN = /\.(mp3|wav|ogg|m4a|aac|flac)(\?|#|$)/i;

type ListState = {
  activeTrackId: string | null;
  autoplayTrackId: string | null;
};

type ListAction =
  | { type: "ACTIVATE_TRACK"; trackId: string }
  | { type: "QUEUE_AUTOPLAY_TRACK"; trackId: string | null }
  | { type: "CLEAR_AUTOPLAY_TRACK"; trackId: string };

const LIST_INITIAL_STATE: ListState = {
  activeTrackId: null,
  autoplayTrackId: null,
};

const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case "ACTIVATE_TRACK":
      return {
        activeTrackId: action.trackId,
        autoplayTrackId: null,
      };
    case "QUEUE_AUTOPLAY_TRACK":
      if (!action.trackId) {
        return { ...state, autoplayTrackId: null };
      }

      return {
        activeTrackId: action.trackId,
        autoplayTrackId: action.trackId,
      };
    case "CLEAR_AUTOPLAY_TRACK":
      return state.autoplayTrackId === action.trackId
        ? { ...state, autoplayTrackId: null }
        : state;
    default:
      return state;
  }
};

export const isAudioUrl = (url: string) => AUDIO_URL_PATTERN.test(url);

export const AudioPlayerList: React.FC<AudioPlayerListProps> = ({
  tracks,
  ...rest
}) => {
  const audioTracks = useMemo(
    () => tracks.filter((track) => isAudioUrl(track.url)),
    [tracks],
  );
  const [state, dispatch] = useReducer(listReducer, LIST_INITIAL_STATE);

  const activateTrack = useCallback((trackId: string) => {
    dispatch({ type: "ACTIVATE_TRACK", trackId });
  }, []);

  const clearAutoplayTrack = useCallback((trackId: string) => {
    dispatch({ type: "CLEAR_AUTOPLAY_TRACK", trackId });
  }, []);

  const playNextTrack = useCallback(
    (trackId: string) => {
      const currentIndex = audioTracks.findIndex(
        (track) => track.id === trackId,
      );
      if (currentIndex < 0 || currentIndex >= audioTracks.length - 1) {
        dispatch({ type: "QUEUE_AUTOPLAY_TRACK", trackId: null });
        return;
      }

      const nextTrack = audioTracks[currentIndex + 1];
      dispatch({ type: "QUEUE_AUTOPLAY_TRACK", trackId: nextTrack.id });
    },
    [audioTracks],
  );

  if (audioTracks.length === 0) {
    return null;
  }

  return (
    <Stack direction="vertical" {...rest}>
      {audioTracks.map((track) => (
        <AudioPlayer
          key={track.id}
          trackId={track.id}
          src={track.url}
          title={track.title ?? "Audio"}
          isActive={state.activeTrackId === track.id}
          shouldAutoplay={state.autoplayTrackId === track.id}
          onActivate={activateTrack}
          onAutoplayHandled={clearAutoplayTrack}
          onEnded={playNextTrack}
        />
      ))}
    </Stack>
  );
};
