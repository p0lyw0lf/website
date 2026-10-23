/** Validates that a value is of a given type. Throws if it's not. */
export type Validator<T> = (value: unknown) => T;
