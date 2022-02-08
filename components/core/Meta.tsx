import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";

type MetaProps = {
  /* ~60 characters */
  title: string;
  /* ~155–160 characters */
  description?: string;
  /* Crop to 1200x630 */
  image?: string;
};

export const Meta: FC<MetaProps> = ({
  title: _title,
  description = "",
  image = "",
}) => {
  const router = useRouter();
  const url = `https://www.damonzucconi.com${router.asPath}`;
  const title =
    _title === "Damon Zucconi" ? _title : `${_title} | Damon Zucconi`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Facebook */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image}></meta>

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:image" content={image}></meta>
    </Head>
  );
};
