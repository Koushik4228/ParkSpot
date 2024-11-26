// import { defineConfig } from "cypress";

// export default defineConfig({
//   component: {
//     devServer: {
//       framework: "react",
//       bundler: "vite",
//     },
//   },

//   component: {
//     devServer: {
//       framework: "react",
//       bundler: "vite",
//     },
//   },
// });


// const { defineConfig } = require("cypress");
 
// module.exports = defineConfig({
//   component: {
//     devServer: {
//       framework: "react",
//       bundler: "vite",
//     },
//   },
// });


const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}", // Adjust to your test file location
    supportFile: false, 
  },
});
