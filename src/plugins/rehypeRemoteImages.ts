import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { AstroData } from "./remarkCollectRemoteImages";

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
  return (tree, file) => {
    const imageOccurrenceMap = new Map();

    visit(tree, (node, index, parent) => {
      if (node.type !== "element") return;
      if (node.tagName !== "img") return;

      if (typeof node.properties?.src !== "string") return;

      node.properties.src = decodeURI(node.properties.src);

      if (
        !(
          file.data.astro as AstroData
        ).frontmatter.__remoteImagePaths?.includes(node.properties.src)
      )
        return;

      const { ...props } = node.properties;

      const imageIndex = imageOccurrenceMap.get(node.properties.src) || 0;
      imageOccurrenceMap.set(node.properties.src, imageIndex + 1);

      node.properties["__POLYWOLF_IMAGE_"] = JSON.stringify({
        inferSize: "width" in props && "height" in props ? undefined : true,
        ...props,
        index: imageIndex,
      });
      const newNode: Element = {
        type: "element",
        tagName: "a",
        properties: {
          href: node.properties.src,
        },
        children: [node],
      };

      Object.keys(props).forEach((prop) => {
        delete node.properties[prop];
      });

      parent!.children[index!] = newNode;
    });
  };
};

export default rehypeRemoteImages;
