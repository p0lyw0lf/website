import type { StoreObject } from "driver";
import type { ConvertOpts } from "../runtime/image/types";

type KnownImageProps = {
  /** Original src of the media to load */
  src: StoreObject;
  /** Original output filename/url of the media to load. */
  url: string;
  /** Options for how to transform the main image shown. */
  defaultOpts?: ConvertOpts;
  /** Options for how to transform other sources shown in a `<picture>` element. */
  otherOpts?: ConvertOpts[];
};

/** Other attributes added directly to the `<img>` element. */
type UnknownImageProps = {
  [attr in string]?: unknown;
};

export type ImageProps = KnownImageProps & UnknownImageProps;
