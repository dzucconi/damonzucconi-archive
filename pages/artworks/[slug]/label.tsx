import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { gql } from "urql";
import styled, { createGlobalStyle } from "styled-components";
import QRCode from "qrcode";
import {
  ArtworkLabelQuery,
  ArtworkLabelSlugsQuery,
} from "../../../generated/graphql";
import { client } from "../../../lib/urql";
import { TOMBSTONE_ARTWORK_FRAGMENT } from "../../../components/pages/Tombstone";

const BASE_URL = "https://www.damonzucconi.com";

const ARTWORK_LABEL_QUERY = gql`
  query ArtworkLabelQuery($id: ID!) {
    artwork(id: $id) {
      ...Tombstone_artwork
      id
      slug
      title
      year
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
  artwork: ArtworkLabelQuery["artwork"];
  artworkUrl: string;
  qrCodeSvg: string;
};

const dimensionsToString = (
  dimensions: ArtworkLabelQuery["artwork"]["dimensions"],
) => {
  if (!dimensions) return null;

  const inches = dimensions.inches.to_s?.replace("in", "").trim();
  const centimeters = dimensions.centimeters.to_s?.replace("cm", "").trim();

  return [inches && `${inches} in`, centimeters && `${centimeters} cm`]
    .filter(Boolean)
    .join(" / ");
};

const ArtworkLabelPage = ({
  artwork,
  artworkUrl,
  qrCodeSvg,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const details = [
    artwork.material,
    dimensionsToString(artwork.dimensions),
    artwork.duration,
    artwork.collector_byline,
  ].filter(
    (detail): detail is string =>
      typeof detail === "string" && detail.length > 0,
  );

  return (
    <>
      <Head>
        <title>{`${artwork.title} label | Damon Zucconi`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PrintStyles />

      <Label>
        <CropMarks aria-hidden="true">
          <CropMark $corner="top-left" $axis="horizontal" />
          <CropMark $corner="top-left" $axis="vertical" />
          <CropMark $corner="top-right" $axis="horizontal" />
          <CropMark $corner="top-right" $axis="vertical" />
          <CropMark $corner="bottom-right" $axis="horizontal" />
          <CropMark $corner="bottom-right" $axis="vertical" />
          <CropMark $corner="bottom-left" $axis="horizontal" />
          <CropMark $corner="bottom-left" $axis="vertical" />
        </CropMarks>

        <Qr>
          <QrCode dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
          <QrUrl>{artworkUrl}</QrUrl>
        </Qr>

        <Artwork>
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
        </Signature>
      </Label>
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

  return {
    props: {
      artwork: result.data.artwork,
      artworkUrl,
      qrCodeSvg,
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

  @media screen {
    margin-top: 2rem;
  }

  @media print {
    width: 7in;
    min-height: 3.5in;
    margin: 0.35in auto 0;
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
    margin: 0.5in;
  }

  @media print {
    body {
      margin: 0;
    }
  }
`;

const CropMarks = styled.div`
  --crop-mark-length: 0.18in;
  --crop-mark-gap: 0.12in;
  --crop-mark-bleed: calc(var(--crop-mark-length) + var(--crop-mark-gap));

  position: absolute;
  inset: calc(var(--crop-mark-bleed) * -1);
  z-index: 1;
  pointer-events: none;
`;

type CropMarkProps = {
  $corner: "top-left" | "top-right" | "bottom-right" | "bottom-left";
  $axis: "horizontal" | "vertical";
};

const CropMark = styled.span<CropMarkProps>`
  position: absolute;
  display: block;
  background: currentColor;

  ${({ $axis }) =>
    $axis === "horizontal"
      ? `
        width: var(--crop-mark-length);
        height: 1px;
      `
      : `
        width: 1px;
        height: var(--crop-mark-length);
      `}

  ${({ $corner, $axis }) => {
    const isTop = $corner.startsWith("top");
    const isLeft = $corner.endsWith("left");
    const edge = isLeft ? "left" : "right";
    const side = isTop ? "top" : "bottom";

    if ($axis === "horizontal") {
      return `
        ${side}: var(--crop-mark-bleed);
        ${edge}: 0;
      `;
    }

    return `
      ${side}: 0;
      ${edge}: var(--crop-mark-bleed);
    `;
  }}
`;

const Title = styled.h1``;

const Year = styled.div``;

const Details = styled.div``;

const Detail = styled.div``;

const Signature = styled.section`
  align-self: start;
  width: 2.5in;
`;

const SignatureLine = styled.div`
  height: 0.65in;
  border-bottom: 1px solid currentColor;
`;

const Qr = styled.aside`
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

const QrUrl = styled.div`
  margin-top: 0.08in;
  overflow-wrap: anywhere;
  font-size: 7pt;
`;
