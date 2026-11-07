import { expect, test } from "bun:test";
import { RELEASE_REPO } from "../lib/release-source";

test("development keeps the upstream provenance fixture identity", () => {
  expect(RELEASE_REPO).toBe("7heMech/cloudpanel-addons");
});

test("a compiled fork binds its release source at build time", async () => {
  const built = await Bun.build({
    entrypoints: [new URL("../lib/release-source.ts", import.meta.url).pathname],
    target: "bun",
    define: { CLP_ADDONS_REPOSITORY: JSON.stringify("metalcated/cloudpanel-addons") },
  });
  expect(built.success).toBe(true);
  const source = await built.outputs[0]!.text();
  const compiled = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
  expect(compiled.RELEASE_REPO).toBe("metalcated/cloudpanel-addons");
});
