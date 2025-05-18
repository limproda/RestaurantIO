module.exports = {
  // Preset que permite usar la sintaxis moderna de JavaScript
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" }, // Objetivo de compilación: la versión actual de Node.js
      },
    ],
  ],
};
