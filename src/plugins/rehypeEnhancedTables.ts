import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/*
 * A stripped-down version of
 * https://github.com/benjamincharity/rehype-enhanced-tables that only adds a
 * wrapper div with a custom class.
 */
export const rehypeEnhancedTables: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "table" && index !== undefined && parent) {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: "table-wrapper",
          },
          children: [node],
        };
        parent.children[index] = wrapper;
      }
    });
  };
};

export default rehypeEnhancedTables;
