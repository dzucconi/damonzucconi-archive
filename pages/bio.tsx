import {
  Box,
  Button,
  Caret,
  Cell,
  Dropdown,
  Input,
  Modal,
  PaneOption,
  Stack,
} from "@auspices/eos/client";
import { useRouter } from "next/router";
import { ChangeEvent, FC, Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { CvPageQueryDocument, useCvPageQuery } from "../generated/graphql";
import {
  BIO_LENGTH_PRESETS,
  BioEntry,
  BioLength,
  BioMode,
  BioOptions,
  BioSentence,
  formatExhibitionLabel,
  generateBio,
  getGroupExhibitions,
  toHtml,
  toMarkdown,
  toPlainText,
} from "../lib/bio";
import { buildGetStaticProps, withUrql } from "../lib/urql";
import Link from "next/link";

type QueryValue = string | string[] | undefined;

type ResolvedBioOptions = Required<
  Pick<BioOptions, "length" | "mode" | "seed" | "soloCount" | "groupCount">
> &
  Pick<
    BioOptions,
    "practiceSeed" | "soloSeed" | "groupSeed" | "closingSeed" | "groupSelection"
  >;

type CopyFormat = "plain" | "markdown" | "html";

const DEFAULT_LENGTH: BioLength = "long";
const DEFAULT_MODE: BioMode = "recent";
const DEFAULT_SEED = 1985;

const LENGTH_OPTIONS: { label: string; value: BioLength }[] = [
  { label: "Short", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Long", value: "long" },
];

const MODE_OPTIONS: { label: string; value: BioMode }[] = [
  { label: "Most recent", value: "recent" },
  { label: "Random", value: "random" },
];

const FORMAT_OPTIONS: { label: string; value: CopyFormat }[] = [
  { label: "Plain text", value: "plain" },
  { label: "Markdown", value: "markdown" },
  { label: "HTML", value: "html" },
];

const SECTION_SEED_PARAMS = {
  practice: "ps",
  solo: "ss",
  group: "gs",
  closing: "cs",
} as const;

type RerollableKey = keyof typeof SECTION_SEED_PARAMS;

const SECTION_SEED_KEYS: Record<
  RerollableKey,
  "practiceSeed" | "soloSeed" | "groupSeed" | "closingSeed"
> = {
  practice: "practiceSeed",
  solo: "soloSeed",
  group: "groupSeed",
  closing: "closingSeed",
};

const isRerollable = (key: BioSentence["key"]): key is RerollableKey => {
  return key in SECTION_SEED_PARAMS;
};

const randomSeed = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

const first = (value: QueryValue) => {
  return Array.isArray(value) ? value[0] : value;
};

const parseLength = (value: QueryValue): BioLength => {
  const normalized = first(value);

  if (
    normalized === "short" ||
    normalized === "medium" ||
    normalized === "long"
  ) {
    return normalized;
  }

  return DEFAULT_LENGTH;
};

const parseMode = (value: QueryValue): BioMode => {
  return first(value) === "random" ? "random" : DEFAULT_MODE;
};

const parseNumber = (value: QueryValue, fallback: number, max = 10) => {
  const parsed = Number.parseInt(first(value) ?? "", 10);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.max(0, Math.min(max, parsed));
};

const parseOptionalSeed = (value: QueryValue): number | undefined => {
  const parsed = Number.parseInt(first(value) ?? "", 10);

  if (!Number.isFinite(parsed)) return undefined;

  return Math.max(0, parsed);
};

const parseIndices = (value: QueryValue): number[] | undefined => {
  const raw = first(value);

  if (raw === undefined) return undefined;

  const indices = raw
    .split(",")
    .map((part) => Number.parseInt(part, 10))
    .filter((index) => Number.isFinite(index) && index >= 0);

  return [...new Set(indices)];
};

const parseOptions = (
  query: Record<string, QueryValue>,
): ResolvedBioOptions => {
  const length = parseLength(query.length);
  const preset = BIO_LENGTH_PRESETS[length];

  return {
    length,
    mode: parseMode(query.mode),
    seed: parseNumber(query.seed, DEFAULT_SEED, Number.MAX_SAFE_INTEGER),
    soloCount: parseNumber(query.solo, preset.soloCount),
    groupCount: parseNumber(query.group, preset.groupCount),
    practiceSeed: parseOptionalSeed(query.ps),
    soloSeed: parseOptionalSeed(query.ss),
    groupSeed: parseOptionalSeed(query.gs),
    closingSeed: parseOptionalSeed(query.cs),
    groupSelection: parseIndices(query.gx),
  };
};

const toQuery = (options: ResolvedBioOptions) => {
  const query: Record<string, string> = {
    length: options.length,
    mode: options.mode,
    seed: String(options.seed),
    solo: String(options.soloCount),
    group: String(options.groupCount),
  };

  (Object.keys(SECTION_SEED_PARAMS) as RerollableKey[]).forEach((key) => {
    const value = options[SECTION_SEED_KEYS[key]];

    if (value !== undefined) {
      query[SECTION_SEED_PARAMS[key]] = String(value);
    }
  });

  if (options.groupSelection !== undefined) {
    query.gx = options.groupSelection.join(",");
  }

  return query;
};

type SelectControlProps<T extends string> = {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};

const SelectControl = <T extends string>({
  label,
  options,
  value,
  onChange,
  ...rest
}: SelectControlProps<T>) => {
  const selected = options.find((option) => option.value === value);

  return (
    <Stack direction="horizontal" {...rest}>
      <Cell variant="small">{label}</Cell>

      <Dropdown
        width="100%"
        label={({ open, ref, disabled, onMouseDown, onClick }) => (
          <Button
            ref={ref}
            variant="small"
            disabled={disabled}
            onMouseDown={onMouseDown}
            onClick={onClick}
            type="button"
            width="100%"
          >
            {selected?.label ?? value}
            <Caret ml={3} direction={open ? "up" : "down"} />
          </Button>
        )}
      >
        {({ handleClose }) =>
          options.map((option) => (
            <PaneOption
              key={option.value}
              onClick={() => {
                onChange(option.value);
                handleClose();
              }}
            >
              {option.label}
            </PaneOption>
          ))
        }
      </Dropdown>
    </Stack>
  );
};

type GroupSelectControlProps = {
  entries: BioEntry[];
  selection: number[] | undefined;
  onChange: (selection: number[] | undefined) => void;
};

const GroupSelectControl: FC<GroupSelectControlProps> = ({
  entries,
  selection,
  onChange,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const toggle = (index: number) => {
    const current = selection ?? [];

    onChange(
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    );
  };

  return (
    <Stack direction="horizontal" {...rest}>
      <Cell variant="small" style={{ whiteSpace: "nowrap" }}>
        Group shows
      </Cell>

      <Button
        variant="small"
        type="button"
        width="100%"
        onClick={() => setOpen(true)}
      >
        {selection ? `Manual (${selection.length})` : "Automatic"}
        <Caret ml={3} direction="down" />
      </Button>

      {open && (
        <Modal overlay zIndex={100} onClose={() => setOpen(false)}>
          <Stack
            bg="background"
            border="1px solid"
            borderColor="border"
            width={["95vw", "90vw", "75ch"]}
            maxHeight="85vh"
          >
            <Box overflowY="auto" minHeight={0}>
              <Stack>
                {entries.map((entry, index) => {
                  const selected = selection?.includes(index) ?? false;

                  return (
                    <Button
                      key={index}
                      type="button"
                      width="100%"
                      flexShrink={0}
                      justifyContent="flex-start"
                      textAlign="left"
                      selected={selected}
                      onClick={() => toggle(index)}
                    >
                      {formatExhibitionLabel(entry)}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            <Stack direction="horizontal">
              <Button
                type="button"
                flex={1}
                onClick={() => onChange(undefined)}
                disabled={selection === undefined}
                style={{ zIndex: 0 }}
              >
                Automatic
              </Button>

              <Button type="button" onClick={() => setOpen(false)} flex={1}>
                Done
              </Button>
            </Stack>
          </Stack>
        </Modal>
      )}
    </Stack>
  );
};

const RerollableSentence = styled.span`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 0.2em;
  }
`;

const Segments: FC<{ sentence: BioSentence }> = ({ sentence }) => {
  return (
    <>
      {sentence.segments.map((segment, i) =>
        segment.italic ? (
          <i key={i}>{segment.text}</i>
        ) : (
          <Fragment key={i}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
};

const BioPage = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<CopyFormat>("plain");
  const [{ fetching, data, error }] = useCvPageQuery();
  const options = useMemo(() => parseOptions(router.query), [router.query]);

  // Give first-time visitors a fresh bio rather than the fixed default seed.
  useEffect(() => {
    if (!router.isReady || router.query.seed !== undefined) return;

    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, seed: String(randomSeed()) },
      },
      undefined,
      { shallow: true, scroll: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const bio = generateBio(data.cv, options);
  const groupExhibitions = getGroupExhibitions(data.cv);
  const wordCount = bio.text.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = bio.text.length;

  const replaceOptions = (nextOptions: ResolvedBioOptions) => {
    setCopied(false);

    router.replace(
      {
        pathname: router.pathname,
        query: toQuery(nextOptions),
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  const updateOptions = (nextOptions: Partial<ResolvedBioOptions>) => {
    replaceOptions({ ...options, ...nextOptions });
  };

  const updateLength = (length: BioLength) => {
    const preset = BIO_LENGTH_PRESETS[length];

    replaceOptions({
      ...options,
      length,
      soloCount: preset.soloCount,
      groupCount: preset.groupCount,
    });
  };

  const updateCount =
    (key: "soloCount" | "groupCount") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateOptions({
        [key]: parseNumber(event.currentTarget.value, options[key]),
      });
    };

  const regenerate = () => {
    replaceOptions({
      ...options,
      seed: randomSeed(),
      practiceSeed: undefined,
      soloSeed: undefined,
      groupSeed: undefined,
      closingSeed: undefined,
    });
  };

  const reroll = (key: RerollableKey) => {
    const optionKey = SECTION_SEED_KEYS[key];
    const current = bio.sentences.find((sentence) => sentence.key === key);
    const currentText = current ? toPlainText([current]) : "";

    // A random seed can reproduce the current sentence; retry until the
    // section actually changes.
    for (let attempt = 0; attempt < 100; attempt++) {
      const seed = randomSeed();
      const candidate: ResolvedBioOptions = { ...options, [optionKey]: seed };
      const sentence = generateBio(data.cv, candidate).sentences.find(
        (next) => next.key === key,
      );

      if (!sentence || toPlainText([sentence]) !== currentText) {
        updateOptions({ [optionKey]: seed });
        return;
      }
    }
  };

  const copy = async () => {
    const plainText = bio.text;

    if (format === "plain") {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([plainText], { type: "text/plain" }),
            "text/html": new Blob([toHtml(bio.sentences)], {
              type: "text/html",
            }),
          }),
        ]);
      } catch {
        await navigator.clipboard.writeText(plainText);
      }
    } else {
      await navigator.clipboard.writeText(
        format === "markdown"
          ? toMarkdown(bio.sentences)
          : toHtml(bio.sentences),
      );
    }

    setCopied(true);
  };

  return (
    <>
      <Meta title="Bio" />

      <Stack spacing={6}>
        <Stack width="fit-content">
          <SelectControl
            label="Length"
            options={LENGTH_OPTIONS}
            value={options.length}
            onChange={updateLength}
          />

          <SelectControl
            label="Selection"
            options={MODE_OPTIONS}
            value={options.mode}
            onChange={(mode) => updateOptions({ mode })}
          />

          <CountControl
            label="Solo exhibitions"
            value={options.soloCount}
            onChange={updateCount("soloCount")}
          />

          <CountControl
            label="Group exhibitions"
            value={options.groupCount}
            onChange={updateCount("groupCount")}
            disabled={options.groupSelection !== undefined}
          />

          <GroupSelectControl
            entries={groupExhibitions}
            selection={options.groupSelection}
            onChange={(groupSelection) => updateOptions({ groupSelection })}
          />

          <SelectControl
            label="Format"
            options={FORMAT_OPTIONS}
            value={format}
            onChange={setFormat}
          />

          <Stack direction="vertical">
            <Button variant="small" type="button" onClick={regenerate}>
              Regenerate
            </Button>

            <Button variant="small" type="button" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          <Box
            fontSize={[2, 3, 4]}
            lineHeight="body"
            style={{ textWrap: "pretty" }}
          >
            {bio.sentences.map((sentence, i) => (
              <Fragment key={sentence.key}>
                {i > 0 && " "}

                {isRerollable(sentence.key) ? (
                  <RerollableSentence
                    title="Click to re-roll this sentence"
                    onClick={() => reroll(sentence.key as RerollableKey)}
                  >
                    <Segments sentence={sentence} />
                  </RerollableSentence>
                ) : (
                  <Segments sentence={sentence} />
                )}
              </Fragment>
            ))}
          </Box>

          <Box
            as={Link}
            href={router.asPath}
            target="_blank"
            fontSize={0}
            color="secondary"
          >
            {wordCount} / {characterCount}
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

type CountControlProps = {
  label: string;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const CountControl: FC<CountControlProps> = ({
  label,
  value,
  onChange,
  disabled,
  ...rest
}) => {
  return (
    <Stack direction="horizontal" {...rest}>
      <Cell variant="small" style={{ whiteSpace: "nowrap" }}>
        {label}
      </Cell>

      {/* eos filters the `disabled` prop from the DOM, so disable manually. */}
      <Input
        type="number"
        min={0}
        max={10}
        value={value}
        onChange={onChange}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        aria-disabled={disabled}
        color={disabled ? "tertiary" : "primary"}
        borderColor={disabled ? "tertiary" : "border"}
        style={disabled ? { pointerEvents: "none" } : undefined}
        width="100%"
        fontSize={[0, 0, 1]}
        px={3}
        py={2}
        height="auto"
      />
    </Stack>
  );
};

BioPage.getLayout = NavigationLayout;

export default withUrql(BioPage);

export const getStaticProps = buildGetStaticProps(() => [CvPageQueryDocument]);
