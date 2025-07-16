export const toShortISODate = (
  d: Date,
): string => // "ja" formats dates like 2006/04/03, and then we replace "/" with "-"
  d
    .toLocaleDateString("ja", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", "-");
