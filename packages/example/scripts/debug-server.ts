import * as rollup from "rollup";
import rollupServerBuildConfig from "./utils/rollup-server-build.config";

rollup.watch(rollupServerBuildConfig);
