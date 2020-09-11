module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  roots: ["<rootDir>/test"],
  testRegex: "test/(.+)\\.test\\.(jsx?|tsx?|vue?)$",
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "vue"],
};
