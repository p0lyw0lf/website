import { run_tera } from "driver";

/** @type {import("./types.js").TemplateInput} */
const { inputPath, outputPath } = ARG;
export default await run_tera(inputPath, { outputPath });
