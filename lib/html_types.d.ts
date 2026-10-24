export interface HTML extends string {
  /** Stores some CSS for retrieval later in the `<head>` */
  withStyle: (css: string) => HTML;
  /** Serializes the HTML part into a JSON-compatible string. */
  asJSON: () => string;
  /** Returns just the body part of the HTML object. Can also be cast with String. */
  asString: () => string;
  /** All the styles read so from from interpolation/`.withStyle()` calls. */
  style: string;
}
