import { run_js } from "driver";

/** @type {import("./types.js").TemplateInput} */
const { inputPath, outputPath } = ARG;
export default await run_js(inputPath, outputPath);
