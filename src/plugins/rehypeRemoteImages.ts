import type { Element, Root } from "hast";
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
    visit(tree, (node, index, parent) => {
      if (node.type !== "element") return;
      if (node.tagName !== "img") return;

      if (typeof node.properties?.src !== "string") return;

      node.properties.src = decodeURI(node.properties.src);
      if (!shouldOptimizeImage(node.properties.src)) return;

      const originalSrc = node.properties.src;

      // Add new arguments for getImage
      node.properties.inferSize = true;
      node.properties.widths = [384, 768, 1536];

      // Pass those properties to getImage by hooking into Astro
      node.properties = {
        __ASTRO_IMAGE_: JSON.stringify(node.properties),
      };

      // Make it so we can click on the image to go to the original
      const newNode: Element = {
        type: "element",
        tagName: "a",
        properties: {
          href: originalSrc,
        },
        children: [node],
      };
      parent!.children[index!] = newNode;
    });
  };
};

export default rehypeRemoteImages;
