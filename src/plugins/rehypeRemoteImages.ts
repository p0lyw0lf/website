import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { allowedRemoteDomains } from "../data/config";

/**
 * This plugin takes all `<img src="" />` images whose URLs were found in a
 * previous step, and transforms them to have a special `__POLYWOLF_IMAGE_`
 * property.
 *
 * This is so a later vite plugin can easily find all images we want to
 * transform, and transform them. We need to do the transformation in the Vite
 * layer instead of in the rehype layer because only Vite has access to the
 * proper `getImage` function that will let Astro know it needs to process an
 * image.
 */
export const rehypeRemoteImages: Plugin<[], Root> = () => {
  const allowedDomains = new Set(allowedRemoteDomains);
  const shouldOptimizeImage = (src: string | undefined): boolean => {
    if (!src) return false;
    try {
      const url = new URL(src);
      return allowedDomains.has(url.host);
    } catch {
      return false;
    }
  };

  return (tree) => {
    visit(tree, (node /*, index, parent */) => {
      if (node.type !== "element") return;
      if (node.tagName !== "img") return;

      if (typeof node.properties?.src !== "string") return;

      node.properties.src = decodeURI(node.properties.src);
      if (!shouldOptimizeImage(node.properties.src)) return;

      // TODO: make this actually optimize the image too, with a fancy image service

      // parent!.children[index!] = newNode;
    });
  };
};

export default rehypeRemoteImages;
