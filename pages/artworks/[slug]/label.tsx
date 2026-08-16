import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { gql } from "urql";
import styled, { createGlobalStyle } from "styled-components";
import QRCode from "qrcode";
import {
  ArtworkLabelQuery,
  ArtworkLabelSlugsQuery,
  Tombstone_ArtworkFragment,
} from "../../../generated/graphql";
import { client } from "../../../lib/urql";
import { TOMBSTONE_ARTWORK_FRAGMENT } from "../../../components/pages/Tombstone";

const BASE_URL = "https://www.damonzucconi.com";

const ARTWORK_LABEL_QUERY = gql`
  query ArtworkLabelQuery($id: ID!) {
    artwork(id: $id) {
      ...Tombstone_artwork
    }
  }
  ${TOMBSTONE_ARTWORK_FRAGMENT}
`;

const ARTWORK_LABEL_SLUGS_QUERY = gql`
  query ArtworkLabelSlugsQuery {
    artworks {
      slug
    }
  }
`;

type LabelPageProps = {
  artwork: Tombstone_ArtworkFragment;
  artworkUrl: string;
  qrCodeSvg: string;
  tombstoneQrCodeSvg: string;
  generatedAt: string;
};

const dimensionsToString = (artwork: Tombstone_ArtworkFragment) => {
  const { dimensions } = artwork;

  if (!dimensions) return null;

  const inches = dimensions.inches.to_s?.replace("in", "").trim();
  const centimeters = dimensions.centimeters.to_s?.replace("cm", "").trim();

  return [inches && `${inches} in`, centimeters && `${centimeters} cm`]
    .filter(Boolean)
    .join(" / ");
};

const createTombstoneLines = (artwork: Tombstone_ArtworkFragment) => {
  return [
    "Damon Zucconi",
    artwork.title,
    `${artwork.year}`,
    artwork.material,
    dimensionsToString(artwork),
    artwork.duration,
    artwork.collector_byline,
  ].filter(
    (detail): detail is string =>
      typeof detail === "string" && detail.length > 0,
  );
};

const formatGeneratedAt = (date: Date) => {
  return `${date.toISOString().slice(0, 16).replace("T", " ")} UTC`;
};

const ArtworkLabelPage = ({
  artwork,
  artworkUrl,
  qrCodeSvg,
  tombstoneQrCodeSvg,
  generatedAt,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const half = router.query.half === "bottom" ? "bottom" : "top";
  const details = createTombstoneLines(artwork).slice(3);

  return (
    <>
      <Head>
        <title>{`${artwork.title} | Damon Zucconi`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <PrintStyles />

      <Sheet $half={half}>
        <Label>
          <Qr>
            <QrCode dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
            <QrCode dangerouslySetInnerHTML={{ __html: tombstoneQrCodeSvg }} />
          </Qr>

          <Artwork>
            <Artist>Damon Zucconi</Artist>
            <Title>{artwork.title}</Title>
            <Year>{artwork.year}</Year>

            {details.length > 0 && (
              <Details>
                {details.map((detail) => (
                  <Detail key={detail}>{detail}</Detail>
                ))}
              </Details>
            )}
          </Artwork>

          <Signature>
            <SignatureLine />
            <LabelMeta>
              <MetaUrl>{artworkUrl}</MetaUrl>
              <div>Generated {generatedAt}</div>
            </LabelMeta>
          </Signature>
        </Label>
      </Sheet>
    </>
  );
};

export default ArtworkLabelPage;

export const getStaticProps: GetStaticProps<LabelPageProps> = async (ctx) => {
  const slug = ctx.params?.slug;

  if (typeof slug !== "string") {
    return { notFound: true };
  }

  const artworkUrl = `${BASE_URL}/artworks/${slug}`;
  const result = await client
    .query<ArtworkLabelQuery>(ARTWORK_LABEL_QUERY, { id: slug })
    .toPromise();

  if (result.error || !result.data) {
    return { notFound: true };
  }

  const qrCodeSvg = await QRCode.toString(artworkUrl, {
    type: "svg",
    margin: 1,
    width: 192,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
  const tombstoneQrCodeSvg = await QRCode.toString(
    createTombstoneLines(result.data.artwork).join("\n"),
    {
      type: "svg",
      margin: 1,
      width: 192,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    },
  );

  return {
    props: {
      artwork: result.data.artwork,
      artworkUrl,
      qrCodeSvg,
      tombstoneQrCodeSvg,
      generatedAt: formatGeneratedAt(new Date()),
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client
    .query<ArtworkLabelSlugsQuery>(ARTWORK_LABEL_SLUGS_QUERY, {})
    .toPromise();

  const paths = (data?.artworks ?? []).flatMap(({ slug }) => {
    if (typeof slug !== "string" || slug.length === 0) {
      return [];
    }

    return [{ params: { slug } }];
  });

  return { paths, fallback: "blocking" };
};

const Sheet = styled.div<{ $half: "top" | "bottom" }>`
  box-sizing: border-box;
  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  padding: ${({ $half }) => ($half === "bottom" ? "6in" : "0.5in")} 0.75in
    0.5in;
  background: white;

  @media screen {
    margin-top: 2rem;
  }
`;

const Label = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  box-sizing: border-box;
  width: 7in;
  min-height: 3.5in;
  margin: 0 auto;
  padding: 0.35in;
  color: #000;
  background: white;
  border: 1px solid currentColor;
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  font-size: 12pt;
  line-height: 1.25;
  text-align: left;

  @media print {
    width: 7in;
    min-height: 3.5in;
    margin: 0 auto;
    border: 0;
    break-inside: avoid;
    print-color-adjust: exact;
  }
`;

const Artwork = styled.section`
  align-self: start;
`;

const PrintStyles = createGlobalStyle`
  @page {
    size: letter;
    margin: 0;
  }

  @media print {
    html,
    body {
      margin: 0;
    }
  }
`;

const Title = styled.h1``;

const Artist = styled.div``;

const Year = styled.div``;

const Details = styled.div``;

const Detail = styled.div``;

const Signature = styled.section`
  align-self: start;
  width: 100%;
`;

const SignatureLine = styled.div`
  width: 66%;
  height: 0.65in;
  border-bottom: 1px solid currentColor;
`;

const Qr = styled.aside`
  display: flex;
  gap: 0.125in;
  align-self: start;
`;

const QrCode = styled.div`
  width: 1.5in;
  height: 1.5in;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const MetaUrl = styled.div`
  overflow-wrap: anywhere;
`;

const LabelMeta = styled.div`
  margin-top: 0.08in;
  font-size: 7pt;
`;
