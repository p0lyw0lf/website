/**
 * @param {number} t - seconds since unix epoch
 * @returns {Temporal.Instant}
 */
export const unixEpoch = (t) =>
  Temporal.Instant.fromEpochMilliseconds(t * 1000);

/**
 * @param {Temporal.Instant} t
 * @returns {string}
 */
export const toShortISODate = (t) =>
  t.toZonedDateTimeISO("America/New_York").toPlainDate().toString();
