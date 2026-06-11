import type { CvPageQuery } from "../generated/graphql";

export type BioLength = "short" | "medium" | "long";
export type BioMode = "recent" | "random";

export type BioSentenceKey =
  | "opening"
  | "practice"
  | "solo"
  | "group"
  | "closing";

export type BioSegment = {
  text: string;
  italic?: boolean;
};

export type BioSentence = {
  key: BioSentenceKey;
  segments: BioSegment[];
};

export type BioOptions = {
  length: BioLength;
  mode: BioMode;
  seed: number;
  soloCount?: number;
  groupCount?: number;
  practiceSeed?: number;
  soloSeed?: number;
  groupSeed?: number;
  closingSeed?: number;
  // Indices into getGroupExhibitions(cv); when set, overrides mode/count
  // for the group sentence.
  groupSelection?: number[];
};

export type GeneratedBio = {
  text: string;
  sentences: BioSentence[];
};

type Cv = CvPageQuery["cv"];
type CvCategory = Cv["categories"][number];
type CvYear = CvCategory["years"][number];
type CvEntry = CvYear["entries"][number];

export type BioEntry = CvEntry & {
  year: number;
};

type EntryWithYear = BioEntry;

type LengthPreset = {
  soloCount: number;
  groupCount: number;
};

const NAME = "Damon Zucconi";
const DEGREE = "BFA in Interdisciplinary Sculpture";
const LOCATION = "Beacon, New York";

export const CV_CATEGORIES = {
  born: "Born",
  education: "Education",
  soloExhibitions: "Solo Exhibitions",
  groupExhibitions: "Select Group Exhibitions",
} as const;

export const BIO_LENGTH_PRESETS: Record<BioLength, LengthPreset> = {
  short: { soloCount: 0, groupCount: 0 },
  medium: { soloCount: 3, groupCount: 0 },
  long: { soloCount: 3, groupCount: 3 },
};

const PRACTICE_STATEMENTS = [
  "He uses code to translate between physical and informational space, making orientation and attention newly visible.",
  "He uses software to manipulate existing materials into works that hover between image, text, signal, and residue.",
  "He writes software that renders images and language unstable.",
  "His composite images behave less like pictures than like memories: simultaneous, partial, incompletely recovered.",
  "His practice considers time through software, from loops and counters to questions of state, identity, and memory.",
  "His practice develops systems in which looking, reading, and verification become active and uncertain forms of encounter.",
  "His practice draws on sculpture, software, and network culture to examine how objects and information construct the spaces they inhabit.",
  "His practice engages the internet as both a public space and an intimate site of viewing, reading, and circulation.",
  "His practice examines how meaning persists or degrades as images, texts, and systems move across media, formats, and contexts.",
  "His practice explores the fragile mechanics by which visual information becomes readable, memorable, and strange.",
  "His practice explores the zone where optical experience, symbolic meaning, and computational structure interfere with one another.",
  "His practice treats code as a sculptural instrument for shaping archives, images, texts, and systems of attention.",
  "His software-based works examine how archives can be reopened, transformed, and made newly unstable.",
  "His work asks at what point pattern-finding becomes hallucination.",
  "His work examines how images, texts, and systems become legible through processes of aggregation, distortion, and recognition.",
  "His work recasts familiar formats—books, calendars, captions, databases—as instruments of perceptual estrangement.",
  "His work stages reading as a visual, spatial, and faintly paranoid act of interpretation.",
  "His work treats transformation as both a technical and perceptual problem, moving between reversible encoding and lossy fragmentation.",
  "His work treats websites not as containers for art, but as forms with their own spatial, social, and temporal conditions.",
  "His work uses software to test how meaning emerges from repetition, compression, misreading, and perceptual delay.",
  "Language figures in the work as a material, with weight and behavior apart from what it says.",
  "Much of the work begins as accumulation—images, words, lists, websites—reorganized through systems of his own design.",
  "Perception appears in the work as a feedback loop between the viewer, the image, and the apparatus that produced both.",
  "Randomness enters the work as formalized potential: every decision and none, simultaneously.",
  "Recent work extends these concerns into moving image, synthetic voice, and AI-generated imagery, using loops and captions to unsettle narrative expectation.",
  "Recognition interests him as a bodily event, from word shape and typographic disruption to optical ambiguity.",
  "Subtraction is a recurring method, removing one register of a familiar system so that another mode of perception can surface.",
  "The gap between language and sensation is a space the work continually attempts to occupy.",
  "The work makes its computational processes visible without relying on technological novelty.",
  "The work returns repeatedly to the act of looking itself—its distances, its orientation, its grounding in the body.",
  "Time runs through the work as a material, in loops, counters, clocks, and questions of state.",
  "Working with software, video, print, and online forms, he investigates the thresholds between perception, language, and patterned error.",
];

const SOLO_INTROS = [
  "Recent solo exhibitions include",
  "Selected solo exhibitions include",
  "Solo presentations include",
];

const GROUP_INTROS = [
  "Recent group exhibitions include",
  "Selected group exhibitions include",
  "Group exhibitions include",
];

const LIVES_AND_WORKS_NAMED = [
  `${NAME} currently lives and works in ${LOCATION}.`,
  `${NAME} lives and works in ${LOCATION}.`,
];

const LIVES_AND_WORKS_PRONOUN = [
  `He currently lives and works in ${LOCATION}.`,
  `He lives and works in ${LOCATION}.`,
];

const toRng = (seed: number) => {
  let value = seed || 1;

  return () => {
    value += 0x6d2b79f5;

    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hashLabel = (label: string) => {
  let hash = 2166136261;

  for (let i = 0; i < label.length; i++) {
    hash ^= label.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const subSeed = (seed: number, label: string) => {
  return (seed ^ hashLabel(label)) >>> 0;
};

const pick = <T>(items: T[], rng: () => number): T => {
  return items[Math.floor(rng() * items.length)] ?? items[0];
};

const byYearDesc = (a: EntryWithYear, b: EntryWithYear) => b.year - a.year;

const getCategory = (cv: Cv, name: string) => {
  return cv.categories.find((category) => category.name === name);
};

const flattenEntries = (category?: CvCategory): EntryWithYear[] => {
  if (!category) return [];

  return category.years
    .flatMap((year) =>
      year.entries.map((entry) => ({
        ...entry,
        year: year.year,
      })),
    )
    .sort(byYearDesc);
};

// Samples while preferring entries at venues that haven't been picked yet,
// so a random bio doesn't list the same gallery twice unless it has to.
const sample = (
  items: EntryWithYear[],
  count: number,
  rng: () => number,
): EntryWithYear[] => {
  const pool = [...items];
  const selected: EntryWithYear[] = [];
  const usedVenues = new Set<string>();

  while (pool.length > 0 && selected.length < count) {
    const fresh = pool.filter(
      (entry) => !entry.venue || !usedVenues.has(entry.venue),
    );
    const candidates = fresh.length > 0 ? fresh : pool;
    const item = candidates[Math.floor(rng() * candidates.length)];

    if (!item) break;

    selected.push(item);
    if (item.venue) usedVenues.add(item.venue);
    pool.splice(pool.indexOf(item), 1);
  }

  return selected;
};

const selectEntries = (
  entries: EntryWithYear[],
  count: number,
  mode: BioMode,
  rng: () => number,
) => {
  if (count <= 0) return [];

  if (mode === "recent") {
    return entries.slice(0, count);
  }

  return sample(entries, count, rng).sort(byYearDesc);
};

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const formatCountry = (code: string) => {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

const formatPlace = (entry: Pick<CvEntry, "city" | "region" | "country">) => {
  const parts = [
    entry.city,
    entry.country === "US"
      ? entry.region
      : entry.country
        ? formatCountry(entry.country)
        : null,
  ].filter(Boolean);

  return parts.join(", ");
};

const formatVenuePlace = (
  entry: Pick<CvEntry, "venue" | "city" | "country">,
) => {
  const country =
    entry.country && entry.country !== "US"
      ? formatCountry(entry.country)
      : null;

  return [entry.venue, entry.city, country].filter(Boolean).join(", ");
};

const formatBorn = (entry: EntryWithYear) => {
  const place = formatPlace(entry);

  return place ? `(b. ${entry.year}, ${place})` : `(b. ${entry.year})`;
};

const formatEducation = (entry: EntryWithYear) => {
  const venuePlace = formatVenuePlace(entry);

  if (!venuePlace) {
    return `received his ${DEGREE} in ${entry.year}.`;
  }

  return `received his ${DEGREE} from the ${venuePlace}, in ${entry.year}.`;
};

const plain = (text: string): BioSegment[] => [{ text }];

const formatExhibition = (entry: EntryWithYear): BioSegment[] => {
  const venuePlace = formatVenuePlace(entry);
  const segments: BioSegment[] = [];

  if (entry.title) {
    segments.push({ text: entry.title, italic: true });

    if (venuePlace) {
      segments.push({ text: " at " });
    }
  }

  if (venuePlace) {
    segments.push({ text: venuePlace });
  }

  segments.push({ text: ` (${entry.year})` });

  return segments;
};

// The canonical, year-desc-sorted list that groupSelection indices refer to.
export const getGroupExhibitions = (cv: Cv): BioEntry[] => {
  return flattenEntries(getCategory(cv, CV_CATEGORIES.groupExhibitions));
};

export const formatExhibitionLabel = (entry: BioEntry) => {
  return formatExhibition(entry)
    .map((segment) => segment.text)
    .join("");
};

const joinSegmentList = (items: BioSegment[][]): BioSegment[] => {
  if (items.length === 0) return [];
  if (items.length === 1) return items[0];

  if (items.length === 2) {
    return [...items[0], { text: " and " }, ...items[1]];
  }

  return items.flatMap((item, index) => {
    if (index === 0) return item;

    const separator = index === items.length - 1 ? "; and " : "; ";

    return [{ text: separator }, ...item];
  });
};

export const toPlainText = (sentences: BioSentence[]) => {
  return sentences
    .map((sentence) =>
      sentence.segments.map((segment) => segment.text).join(""),
    )
    .join(" ");
};

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

export const toHtml = (sentences: BioSentence[]) => {
  return sentences
    .map((sentence) =>
      sentence.segments
        .map((segment) =>
          segment.italic
            ? `<i>${escapeHtml(segment.text)}</i>`
            : escapeHtml(segment.text),
        )
        .join(""),
    )
    .join(" ");
};

export const toMarkdown = (sentences: BioSentence[]) => {
  return sentences
    .map((sentence) =>
      sentence.segments
        .map((segment) => (segment.italic ? `*${segment.text}*` : segment.text))
        .join(""),
    )
    .join(" ");
};

export const generateBio = (cv: Cv, options: BioOptions): GeneratedBio => {
  const preset = BIO_LENGTH_PRESETS[options.length];
  const soloCount = options.soloCount ?? preset.soloCount;
  const groupCount = options.groupCount ?? preset.groupCount;

  const practiceRng = toRng(
    options.practiceSeed ?? subSeed(options.seed, "practice"),
  );
  const soloRng = toRng(options.soloSeed ?? subSeed(options.seed, "solo"));
  const groupRng = toRng(options.groupSeed ?? subSeed(options.seed, "group"));
  const closingRng = toRng(
    options.closingSeed ?? subSeed(options.seed, "closing"),
  );

  const born = flattenEntries(getCategory(cv, CV_CATEGORIES.born))[0];
  const education = flattenEntries(getCategory(cv, CV_CATEGORIES.education))[0];
  const solos = selectEntries(
    flattenEntries(getCategory(cv, CV_CATEGORIES.soloExhibitions)),
    soloCount,
    options.mode,
    soloRng,
  );
  const groupEntries = getGroupExhibitions(cv);
  const groups = options.groupSelection
    ? options.groupSelection
        .map((index) => groupEntries[index])
        .filter((entry): entry is EntryWithYear => Boolean(entry))
        .sort(byYearDesc)
    : selectEntries(groupEntries, groupCount, options.mode, groupRng);

  const sentences: BioSentence[] = [];

  if (born && education) {
    sentences.push({
      key: "opening",
      segments: plain(
        `${NAME} ${formatBorn(born)} ${formatEducation(education)}`,
      ),
    });
  } else if (born) {
    sentences.push({
      key: "opening",
      segments: plain(`${NAME} ${formatBorn(born)}.`),
    });
  } else {
    sentences.push({ key: "opening", segments: plain(`${NAME}.`) });
  }

  sentences.push({
    key: "practice",
    segments: plain(pick(PRACTICE_STATEMENTS, practiceRng)),
  });

  if (solos.length > 0) {
    sentences.push({
      key: "solo",
      segments: [
        { text: `${pick(SOLO_INTROS, soloRng)} ` },
        ...joinSegmentList(solos.map(formatExhibition)),
        { text: "." },
      ],
    });
  }

  if (groups.length > 0) {
    sentences.push({
      key: "group",
      segments: [
        { text: `${pick(GROUP_INTROS, groupRng)} ` },
        ...joinSegmentList(groups.map(formatExhibition)),
        { text: "." },
      ],
    });
  }

  // In a short bio the opening sentence is immediately followed by the
  // closer, so repeating the full name reads awkwardly.
  const hasExhibitions = solos.length > 0 || groups.length > 0;
  const closers = hasExhibitions
    ? [...LIVES_AND_WORKS_NAMED, ...LIVES_AND_WORKS_PRONOUN]
    : LIVES_AND_WORKS_PRONOUN;

  sentences.push({
    key: "closing",
    segments: plain(pick(closers, closingRng)),
  });

  return {
    sentences,
    text: toPlainText(sentences),
  };
};
