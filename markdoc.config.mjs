import {
  Markdoc,
  component,
  defineMarkdocConfig,
} from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  tags: {
    n: {
      render: component("./src/markdoc/components/Note.astro"),
      attributes: {
        id: { type: String },
      },
      selfClosing: true,
    },
    fn: {
      render: component("./src/markdoc/components/Footnote.astro"),
      attributes: {
        id: { type: String },
      },
    },
    footnotes: {
      render: component("./src/markdoc/components/Footnotes.astro"),
      transform(node, config) {
        node.children.sort((a, b) =>
          a.attributes.id.localeCompare(b.attributes.id, "en", {
            numeric: true,
          }),
        );

        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);

        return new Markdoc.Tag(this.render, attributes, children);
      },
    },
  },
});
