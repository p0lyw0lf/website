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

export const toCybersecUrl = (slug: string): string => {
  return `/cybersec/${slug}/`;
};

const atprotoPostRegex = /at:\/\/(.*)\/app\.bsky\.feed\.post\/(.*)/;
export const atprotoPostUrl = (atprotoUrl: string): string | undefined => {
  const matches = atprotoUrl.match(atprotoPostRegex);
  const did = matches?.[1];
  const postId = matches?.[2];
  if (did && postId) {
    return `https://bsky.app/profile/${did}/post/${postId}`;
  }
  return undefined;
};
