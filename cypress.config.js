const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
   
    baseUrl: 'https://front.serverest.dev',
    env: {
      apiBaseUrl: 'https://serverest.dev'
    },

    setupNodeEvents(on, config) {
     
    },
  },
});