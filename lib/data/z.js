/**
 * Knockoff version of zod. Only defines the validators that are absolutely necessary,
 * and only defines them as objects once for performance.
 */

/** @returns {import("./types").Validator<string>} */
const string = () => (value) => {
  if (typeof value !== "string")
    throw new Error(`expected string, got ${typeof value}`);
  return value;
};

/**
 * @template T
 * @param {import("./types").Validator<T>} validator
 * @returns {import("./types").Validator<T | null | undefined>}
 */
const optional = (validator) => (value) => {
  if (value === null || value === undefined) return value;
  return validator(value);
};

/**
 * @template T
 * @param {import("./types").Validator<T>} validator
 * @returns {import("./types").Validator<T[]>}
 */
const array = (validator) => (value) => {
  if (!Array.isArray(value))
    throw new Error(`expected array, got ${typeof value}`);
  return value.map(validator);
};

/** @returns {import("./types").Validator<number>} */
const int = () => (value) => {
  if (typeof value !== "number" || !Number.isSafeInteger(value))
    throw new Error(`expected integer, got ${typeof value}`);
  return value;
};

/**
 * @template {Record<string, import("./types").Validator<any>>} Validators
 * @param {Validators} validators
 * @returns {import("./types").Validator<{ [k in keyof Validators]: ReturnType<Validators[k]> }>}
 */
const object = (validators) => (value) => {
  if (typeof value !== "object")
    throw new Error(`expected object, got ${typeof value}`);
  if (value === null) throw new Error("expected object, got null");

  /** @type {any} */
  const v = value;
  /** @type {any} */
  const output = {};
  for (const [key, validator] of Object.entries(validators)) {
    try {
      output[key] = validator(v[key]);
    } catch (err) {
      throw new Error(`at key ${key}: ${err}`);
    }
  }
  /** @type {{ [k in keyof Validators]: Validators[k] }} */
  return output;
};

export const z = {
  array,
  int,
  object,
  optional,
  string,
};
