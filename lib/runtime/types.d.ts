import type { StoreObject } from "driver";

export interface PartialPage {
  inputPath: string;
  frontmatter: Record<string, any>;
  beforeFold: StoreObject;
  body: StoreObject;
}

export interface Page extends PartialPage {
  outputPath: string;
  // Specified if the page is part of a collection
  slug?: string;
  // Specified if the page is an index page
  children?: Page[];
}
