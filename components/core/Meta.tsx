import { gql } from "urql";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";

export const META_IMAGE_FRAGMENT = gql`
  fragment Meta_image on Image {
    resized(width: 1200, height: 630) {
      urls {
        src: _1x
      }
    }
  }
`;

type MetaProps = {
  /* ~60 characters */
  title: string;
  /* ~155–160 characters */
  description?: string;
  /* Crop to 1200x630 */
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
};

const SITE_NAME = "Damon Zucconi";
const BASE_URL = "https://www.damonzucconi.com";
const TWITTER_HANDLE = "@dzucconi";

const toAbsoluteUrl = (value: string) => {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};

export const Meta: FC<MetaProps> = ({
  title: _title,
  description,
  image,
  noIndex = false,
  canonicalUrl,
}) => {
  const router = useRouter();
  const routePath = (router.asPath || "/").split("#")[0].split("?")[0];
  const url = canonicalUrl ? toAbsoluteUrl(canonicalUrl) : `${BASE_URL}${routePath}`;
  const imageUrl = image ? toAbsoluteUrl(image) : undefined;
  const title =
    _title === SITE_NAME ? _title : `${_title} | ${SITE_NAME}`;
  const twitterCard = imageUrl ? "summary_large_image" : "summary";

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />
      <meta name="author" content={SITE_NAME} />

      {/* Facebook */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {imageUrl && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:secure_url" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:domain" content="damonzucconi.com" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:card" content={twitterCard} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:image:alt" content={title} />}
    </Head>
  );
};
