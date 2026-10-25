import type { StoreObject } from "driver";

export interface TemplateInput {
  /** The path, relative to project root, of the input to be templated. */
  inputPath: string;
  /** The path, relative to the output root, of the file to be generated. Can be used to construct URLs. */
  outputPath: string;
}

export type TemplateOutput = StoreObject;
