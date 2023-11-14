import { defineConfig } from "cypress";

const config = {
  screenshotOnRunFailure: false,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    specPattern: "test/**/**/*.test.ts",
  },
};

export default defineConfig(config);
