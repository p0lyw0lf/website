// https://github.com/ota-meshi/eslint-plugin-astro/issues/168
import "astro/astro-jsx";

declare global {
  namespace JSX {
    type Element = HTMLElement;
    type IntrinsicElements = astroHTML.JSX.IntrinsicElements;
  }
}
