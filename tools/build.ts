import { minifyAssetsPlugin } from "./browser-assets";

// One binary: the CLI and every addon's manager, selected at runtime by
// `clp-addons serve`, sharing one copy of the Bun runtime. recon showed avx2 on
// the target CPU, so the standard glibc x64 target applies, not the baseline.
// VERSION, set by the release workflow, is the version the binary reports.

const version = process.env.VERSION;
const repository = process.env.RELEASE_REPO ?? process.env.GITHUB_REPOSITORY ?? "7heMech/cloudpanel-addons";
if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(repository)) {
  throw new Error("RELEASE_REPO must be a GitHub owner/repository");
}

await Bun.build({
  entrypoints: ["cli/index.ts"],
  compile: { target: "bun-linux-x64", outfile: "dist/clp-addons-linux-x64" },
  bytecode: true,
  minify: true,
  format: "esm",
  define: {
    CLP_ADDONS_REPOSITORY: JSON.stringify(repository),
    ...(version ? { "process.env.CLP_ADDONS_VERSION": JSON.stringify(version) } : {}),
  },
  plugins: [await minifyAssetsPlugin()],
  throw: true,
});
