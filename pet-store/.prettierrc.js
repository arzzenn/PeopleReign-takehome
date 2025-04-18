module.exports = {
  plugins: [
    // relative paths are usually required so Prettier can find the plugin
    './node_modules/prettier-plugin-multiline-arrays/dist/index.js',
    './node_modules/prettier-plugin-organize-imports/index.js',
  ],
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
};
