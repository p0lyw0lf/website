import type { Page } from "../../lib/runtime/types";
import { art, blog, cybersec } from "./config.js";

export type ArtSchema = ReturnType<typeof art.schema>;
export type ArtPage = Page<ArtSchema>;

export type BlogSchema = ReturnType<typeof blog.schema>;
export type BlogPage = Page<BlogSchema>;

export type CybersecSchema = ReturnType<typeof cybersec.schema>;
export type CybersecPage = Page<CybersecSchema>;
