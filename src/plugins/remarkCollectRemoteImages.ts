import type { Root } from "mdast";
import { definitions } from "mdast-util-definitions";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface AstroData {
  frontmatter: {
    __remoteImagePaths?: Array<string>;
  };
}

/**
 * This plugin collects all remote images URLs into a "hidden" field in the
 * frontmatter, which is passed through by Astro.
 *
 * We need this remark plugin instead of just a rehype plugin because we want to
 * distinguish between markdown images (the kind that look like `![]()`) and
 * HTML images (the kind that look like `<img src="" />`), because we only want
 * to transform the former, not the latter.  This approach is not perfect,
 * because if there is overlap with the latter it will still be transformed, but
 * meh that's proooobably fine :P
 */
export const remarkCollectRemoteImages: Plugin<[], Root> = () => {
  return (tree, vfile) => {
    if (typeof vfile?.path !== "string") return;

    const definition = definitions(tree);
    const remoteImagePaths = new Set<string>();
    visit(tree, (node) => {
      let url: string | undefined;
      if (node.type === "image") {
        url = decodeURI(node.url);
      } else if (node.type === "imageReference") {
        const imageDefinition = definition(node.identifier);
        if (imageDefinition) {
          url = decodeURI(imageDefinition.url);
        }
      }

      if (url && isValidUrl(url)) remoteImagePaths.add(url);
    });

    (vfile.data.astro as AstroData).frontmatter.__remoteImagePaths =
      Array.from(remoteImagePaths);
  };
};

const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export default remarkCollectRemoteImages;
