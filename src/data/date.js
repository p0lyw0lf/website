/**
 * @param {Temporal.Instant} t
 * @returns {string}
 */
export const toShortISODate = (t) =>
  t.toZonedDateTimeISO("America/New_York").toPlainDate().toString();
