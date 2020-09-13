const { execSync } = require("child_process");
const FSUtils = require("./utils/fs");
const PartsUtils = require("./utils/parts");

const TEMPLATE_FILENAME = "_template.rc";
const OUTPUT_FILENAME = "output/magus.rc";

// ensure output directory
execSync(`rm -rf $(dirname ${OUTPUT_FILENAME})`);
execSync(`mkdir -p $(dirname ${OUTPUT_FILENAME})`);

let OUTPUT_RC = FSUtils.read(TEMPLATE_FILENAME);

// Replace ## Headers with proper part util function output
OUTPUT_RC = PartsUtils.RunRegex(
  /\#--([^\s]+)(.*)/g,
  OUTPUT_RC,
  (headerType, args) => PartsUtils[headerType](args)
);

// Replace `{{Filename.ext}}` with the file content using PartsUtil.ContentFormatter
OUTPUT_RC = PartsUtils.RunRegex(/{{(.*)}}/g, OUTPUT_RC, (filename) => {
  return PartsUtils.ContentFormatter(
    filename,
    FSUtils.read(`parts/${filename}`)
  );
});

FSUtils.write(OUTPUT_FILENAME, OUTPUT_RC);

// Copy content to clipboard
execSync(`cat ${OUTPUT_FILENAME} | pbcopy`);

console.info(`🤖 Generated ${OUTPUT_FILENAME} copied to clipboard! 📋`);
