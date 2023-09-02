export interface ImageMetadata {
    src: string;
    width: number;
    height: number;
    format: "png" | "jpeg" | "webp" | "jpg" | "tiff" | "gif" | "svg";
}