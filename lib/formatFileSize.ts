export const formatFileSize = (bytes: unknown) => {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value < 0) return "—";
  if (value === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(value) / Math.log(1000)),
    units.length - 1,
  );
  const size = value / 1000 ** unitIndex;

  return `${size.toLocaleString("en-US", {
    maximumFractionDigits: unitIndex === 0 ? 0 : 2,
  })} ${units[unitIndex]}`;
};
