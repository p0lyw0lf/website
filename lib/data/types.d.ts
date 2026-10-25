import type { Page } from "../runtime/types";

/** Validates that a value is of a given type. Throws if it's not. */
export type Validator<T> = (value: unknown) => T;

export interface PageWithSlug<F> extends Page<F> {
  outputPath?: never;
  slug: string;
  isDraft?: boolean;
}

export type SingleLoader<Schema> = (
  file: string,
) => Promise<PageWithSlug<Schema> | undefined>;
export type MultiLoader<Schema> = () => Promise<Array<PageWithSlug<Schema>>>;

export interface Collection<Schema> {
  base: string;
  schema: Validator<Schema>;
  single: SingleLoader<Schema>;
  all: MultiLoader<Schema>;
}
