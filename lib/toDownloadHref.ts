// Maps an S3 URL (virtual-hosted or path-style) to the same-origin
// `/downloads` rewrite (see next.config.js) so the native `download`
// attribute is honored; browsers ignore it on cross-origin links.
export const toDownloadHref = (url: string) => {
  const { host, pathname } = new URL(url);

  if (host === "zucconi.s3.amazonaws.com") {
    return `/downloads${pathname}`;
  }

  if (host === "s3.amazonaws.com" && pathname.startsWith("/zucconi/")) {
    return `/downloads${pathname.replace("/zucconi", "")}`;
  }

  return url;
};
