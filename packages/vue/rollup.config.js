import esbuild from "rollup-plugin-esbuild";

export default {
  input: ["src/index.ts", "src/icons/index.ts", "src/icons/names.ts"],
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: false,
  },
  treeshake: true,
  plugins: [esbuild({ target: "esnext" })],
  external: ["vue"],
};
