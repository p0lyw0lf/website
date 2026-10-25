import type { StoreObject } from "driver";

export interface PartialPage {
  inputPath: string;
  frontmatter: Record<string, any>;
  beforeFold: StoreObject;
  body: StoreObject;
}

export interface Page<
  F extends Record<string, any> = Record<string, any>,
> extends PartialPage {
  frontmatter: F;
  outputPath: string;
  // Specified if the page is an index page
  children?: Page[];
}
