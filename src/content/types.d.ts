import { PageWithSlug } from "../../lib/data/types";
import { art, blog, cybersec } from "./config.js";

export type ArtSchema = ReturnType<typeof art.schema>;
export type ArtPage = PageWithSlug<ArtSchema>;

export type BlogSchema = ReturnType<typeof blog.schema>;
export type BlogPage = PageWithSlug<BlogSchema>;

export type CybersecSchema = ReturnType<typeof cybersec.schema>;
export type CybersecPage = PageWithSlug<CybersecSchema>;
