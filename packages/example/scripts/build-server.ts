import * as rollup from "rollup";
import rollupServerBuildConfig from "./utils/rollup-server-build.config";

rollupServerBuildConfig.forEach(async (currentConfig) => {
  let bundle;
  try {
    bundle = await rollup.rollup(currentConfig);
    await bundle.generate(currentConfig);
    await bundle.write(currentConfig);
    await bundle.close();
  } catch (error) {
    console.error(error);
    if (bundle) {
      await bundle.close();
    }
    process.exit(1);
  }
});
