import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import nesting from "postcss-nesting";
import css_variables from "postcss-css-variables";

export default {
  plugins: [nesting({}), css_variables({}), autoprefixer, cssnanoPlugin],
};
