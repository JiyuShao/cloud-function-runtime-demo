import { Configuration } from "webpack";
import 'webpack-dev-server';
// import HtmlWebpackPlugin from "html-webpack-plugin";
import { v5 as uuidv5 } from "uuid";
import WebpackServerBuildPlugin from "./webpack-server-build-plugin";
import { resolvePath, getMatchedApiFilePath } from "./path";
import config from "./config";

/**
 * 自动获取 webpack entry
 */
function getEntrys(): Record<string, string> {
  const matchedApiFiles = getMatchedApiFilePath(
    config.cwd,
    config.apiFilePattern
  );
  const entry: Record<string, string> = matchedApiFiles.reduce<
    Record<string, string>
  >((prev, current) => {
    prev[uuidv5(current, config.namespace)] = current;
    return prev;
  }, {});
  return entry;
}

export default function getWebpackConfig(
  mode: Configuration["mode"]
): Configuration {
  const configuration: Configuration = {
    mode,
    target: "node",
    entry: getEntrys(),
    output: {
      path: resolvePath("dist/server"),
    },
    devServer: {
      port: 3000,
      // open: true,
    },
    devtool: "source-map",
    resolve: {
      extensions: [".js", ".ts"],
      alias: {
        "@api": resolvePath("src/api"),
        "@utils": resolvePath("src/utils"),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ["ts-loader"],
          include: resolvePath("src/api"),
        },
      ],
    },
    plugins: [
      new WebpackServerBuildPlugin({
        cwd: config.cwd,
        apiFilePattern: config.apiFilePattern,
      }),
    ],
    stats: {
      errorDetails: true,
    },
  };
  return configuration;
}
