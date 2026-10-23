import type { StoreObject } from "driver";

export type ImageFormat = "jpeg" | "jxl" | "png" | "webp" | string;
export type ImageSize = { width: number; height: number };

export interface Image {
  object: StoreObject;
  format: ImageFormat;
  size: ImageSize;
}

export type ImageFit = "fill" | "contain" | "cover";

export type EncoderOptions = {
  quality?: number;
  effort?: number;
  stripMetadata?: boolean;
};

/** From `magick -list filter`, the
 * available filters able to be
 * passed to `-filter` when resizing.
 * */
export type ResizeMethod =
  | "Bartlett"
  | "Blackman"
  | "Bohman"
  | "Box"
  | "Catrom"
  | "Cosine"
  | "Cubic"
  | "Gaussian"
  | "Hamming"
  | "Hann"
  | "Hermite"
  | "Jinc"
  | "Kaiser"
  | "Lagrange"
  | "Lanczos"
  | "Lanczos2"
  | "Lanczos2Sharp"
  | "LanczosRadius"
  | "LanczosSharp"
  | "MagicKernelSharp2013"
  | "MagicKernelSharp2021"
  | "Mitchell"
  | "Parzen"
  | "Point"
  | "Quadratic"
  | "Robidoux"
  | "RobidouxSharp"
  | "Sinc"
  | "SincFast"
  | "Spline"
  | "CubicSpline"
  | "Triangle"
  | "Welch";

export interface PartialConvertOpts {
  format?: ImageFormat;
  encoderOptions?: EncoderOptions;
  resizeMethod?: ResizeMethod;
}

export interface ConvertOpts extends PartialConvertOpts {
  size?: ImageSize;
  fit?: ImageFit;
}
