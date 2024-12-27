export const SITE_URL = new URL("https://wolfgirl.dev/");
export const STATIC_URL = new URL("https://static.wolfgirl.dev/");

export const toArtUrl = (src: string): string => {
  return new URL(`/art/${src}`, STATIC_URL).toString();
};

export const toBlogUrl = (slug: string): string => {
  return `/blog/${slug}/`;
};

export const toTagUrl = (tag: string): string => {
  return `/tags/${tag}/`;
};
