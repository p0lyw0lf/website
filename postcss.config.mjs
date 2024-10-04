import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import nesting from "postcss-nesting";

export default {
  plugins: [nesting({}), autoprefixer, cssnanoPlugin],
};
