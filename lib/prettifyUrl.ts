export const prettifyUrl = (url: string): string => {
  return url
    .replace(/https?:\/\//, "")
    .replace("work.damonzucconi.com", "…")
    .replace(/\/$/, "");
};
