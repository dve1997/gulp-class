// const path = require("path");

const config = {
  mode: "development",
  entry: {
    index: "./src/js/index.js",
    about: "./src/js/about.js",
    contacts: "./src/js/contacts.js",
  },
  output: {
    // path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
};

export default config;
