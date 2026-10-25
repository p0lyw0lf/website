import type { Page } from "../runtime/types";

/** Validates that a value is of a given type. Throws if it's not. */
export type Validator<T> = (value: unknown) => T;

export type SingleLoader<Schema> = (
  file: string,
) => Promise<Page<Schema> | undefined>;
export type MultiLoader<Schema> = () => Promise<Record<string, Page<Schema>>>;

export interface Collection<Schema> {
  base: string;
  schema: Validator<Schema>;
  single: SingleLoader<Schema>;
  all: MultiLoader<Schema>;
}
