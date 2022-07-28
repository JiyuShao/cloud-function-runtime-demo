import { v5 as uuidv5 } from "uuid";
import * as rollup from "rollup";
// plugin-node-resolve and plugin-commonjs are required for a rollup bundled project
// to resolve dependencies from node_modules. See the documentation for these plugins
// for more details.
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { getMatchedApiFilePath, resolvePath } from "./path";
import config, {
  ManifestJson,
  readManifestJson,
  writeManifestJson,
} from "./config";
import rollupPluginPostBuild, {
  RollupPluginPostBuildOptions,
} from "./rollup-plugin-post-build";

/**
 * 根据传入的入口文件绝对路径返回相应的相对路径
 * @param {string} path 入口文件绝对路径
 * @returns {string} 入口文件相对路径
 */
const getRelativeApiFilePath = (path: string) => {
  return path.replace(`${resolvePath("src")}/`, "");
};

/**
 * 根据传入文件绝对路径返回唯一的文件名称
 * @param {string} path 入口文件路径
 * @returns {string} 文件唯一名称
 */
const getUniqueApiFileName = (path: string) => {
  const uniqueFileName = path.replace(/\//g, "_").replace(/.[jt]s$/, "");
  return `${uniqueFileName}.${uuidv5(path, config.namespace)}.js`;
};

/**
 * 更新 server 构建配置
 * @param {RollupPluginPostBuildOptions["callback"]} result
 */
const updateManifest: RollupPluginPostBuildOptions["callback"] = async (
  result
) => {
  console.log(
    `Build ${getRelativeApiFilePath(result.inputFilePath)} to ${
      result.outputFileName
    }`
  );
  const manifestJsonPath = resolvePath("dist/server/manifest.json");
  let manifestJson: ManifestJson = {
    namespace: config.namespace,
    outputApiFileMapping: {},
  };
  try {
    manifestJson = await readManifestJson(manifestJsonPath);
  } catch (_) {}

  try {
    writeManifestJson(manifestJsonPath, {
      ...manifestJson,
      outputApiFileMapping: {
        ...manifestJson.outputApiFileMapping,
        [getRelativeApiFilePath(result.inputFilePath)]: result.outputFileName,
      },
    });
  } catch (error) {
    console.error(`writeManifestJson ${manifestJsonPath} 失败`, error);
  }
};

export default getMatchedApiFilePath(config.cwd, config.apiFilePattern).map(
  (input) => {
    const relativeFilePath = getRelativeApiFilePath(input);
    const uniqueFileName = getUniqueApiFileName(relativeFilePath);

    const rollupConfig: rollup.RollupOptions = {
      input,
      output: {
        exports: "auto",
        format: "cjs",
        file: resolvePath(`dist/server/${uniqueFileName}`),
        sourcemap: true,
      },
      plugins: [
        typescript({ sourceMap: true }),
        commonjs(),
        nodeResolve(),
        rollupPluginPostBuild({
          callback: (...args) => updateManifest(...args),
        }),
      ],
    };
    return rollupConfig;
  }
);
