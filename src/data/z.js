/**
 * Knockoff version of zod. Only defines the validators that are absolutely necessary,
 * and only defines them as objects once for performance.
 *
 * @callback Validator - Validates that a value is of a given type. Throws if it's not.
 * @param {unknkown} value
 * @returns {unknown}
 */

/** @returns {Validator} */
const string = () => (value) => {
  if (typeof value !== "string")
    throw new Error(`expected string, got ${typeof value}`);
  return value;
};

/**
 * @param {Validator}
 * @returns {Validator}
 */
const optional = (validator) => (value) => {
  if (!value) return value;
  return validator(value);
};

/**
 * @param {Validator}
 * @returns {Validator}
 */
const array = (validator) => (value) => {
  if (!Array.isArray(value))
    throw new Error(`expected array, got ${typeof value}`);
  return value.map(validator);
};

/** @returns {Validator} */
const int = () => (value) => {
  if (!Number.isSafeInteger(value))
    throw new Error(`expected integer, got ${typeof value}`);
  return value;
};

/**
 * @param {Record<string, Validator>}
 * @returns {Validator}
 */
const object = (validators) => (value) => {
  if (typeof value !== "object")
    throw new Error(`expected object, got ${typeof value}`);
  if (value === null) throw new Error("expected object, got null");

  const output = {};
  for (const [key, validator] of Object.entries(validators)) {
    try {
      output[key] = validator(value[key]);
    } catch (err) {
      throw new Error(`at key ${key}: ${err}`);
    }
  }
  return output;
};

export const z = {
  array,
  int,
  object,
  optional,
  string,
};
