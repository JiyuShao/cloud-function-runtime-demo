import { Configuration } from "webpack";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackStaticBuildPlugin from "./webpack-static-build-plugin";
import { resolvePath } from "./path";
import config from "./config";

export default function getWebpackConfig(
  mode: Configuration["mode"]
): Configuration {
  const configuration: Configuration = {
    mode,
    entry: {
      index: resolvePath("src/index"),
    },
    output: {
      path: resolvePath("dist/static"),
    },
    devServer: {
      port: 3001,
      open: true,
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
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.ts$/,
          use: ["ts-loader"],
          include: resolvePath("src"),
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolvePath("public/index.html"),
      }),
      new WebpackStaticBuildPlugin({
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
