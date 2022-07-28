import { resolve, dirname } from "path";

import { Plugin, RenderedChunk } from "rollup";

export interface RollupPluginPostBuildOptions {
  callback: (result: {
    /** 输入文件路径 */
    inputFilePath: string;
    /** 文件输出目录 */
    outputDir: string;
    /** 文件输出名称 */
    outputFileName: string;
  }) => void;
}

const PLUGIN_NAME = "rollupPluginPostBuild";

export default function rollupPluginPostBuild(
  options: RollupPluginPostBuildOptions
): Plugin {
  let input: string;
  const { callback } = options;

  return {
    name: PLUGIN_NAME,
    buildStart(options) {
      let inputs = options.input;
      if (typeof inputs === "string") {
        inputs = [inputs];
      }
      if (typeof inputs === "object") {
        inputs = Object.values(inputs);
      }
      if (inputs.length > 1) {
        throw new Error(`${PLUGIN_NAME} only works with a single entry point`);
      }

      input = resolve(inputs[0]);
    },

    generateBundle(_outputOptions, _bundle, isWrite) {
      if (!isWrite) {
        this.error(
          `${PLUGIN_NAME} currently only works with bundles that are written to disk`
        );
      }
    },

    writeBundle(outputOptions, bundle) {
      const outputDir = outputOptions.dir || dirname(outputOptions.file!);
      const outputFileName = Object.keys(bundle).find((fileName) => {
        const chunk = bundle[fileName] as RenderedChunk;
        return chunk.isEntry && chunk.facadeModuleId === input;
      });

      if (outputFileName) {
        callback({ outputDir, outputFileName, inputFilePath: input });
      } else {
        this.error(`${PLUGIN_NAME} could not find output chunk`);
      }
    },
  };
}
