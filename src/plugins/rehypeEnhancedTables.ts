import type { Plugin } from "unified";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { inspect } from "util";

/*
Adapted from https://github.com/benjamincharity/rehype-enhanced-tables

MIT License

Copyright (c) 2024 Benjamin Charity
Copyright (c) 2025 PolyWolf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
 * A stripped-down version that only adds a wrapper div with a custom class. For
 * some reason, I couldn't get their plugin to work, so I'm making my own.
 */
export const rehypeEnhancedTables: Plugin<[], Root> = () => {
  return (tree) => {
    console.log(
      inspect(tree, { showHidden: false, depth: null, colors: true }),
    );
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "table" && index !== undefined && parent) {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: "table-wrapper",
          },
          children: [],
        };
        parent.children[index] = wrapper;
      }
    });
  };
};

export default rehypeEnhancedTables;
