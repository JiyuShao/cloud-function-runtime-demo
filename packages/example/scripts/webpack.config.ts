import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackStaticBuildPlugin from "./utils/webpack-static-build-plugin";

function resolvePath(relativePath: string) {
  return path.resolve(__dirname, `../${relativePath}`);
}

export default function getWebpackConfig(
  mode: Configuration["mode"]
): Configuration {
  const config: Configuration = {
    mode,
    entry: {
      index: resolvePath("src/index"),
    },
    output: {
      path: resolvePath("dist"),
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
        cwd: resolvePath("src"),
        apiPattern: "api/**/*.ts",
      }),
    ],
    stats: {
      errorDetails: true,
    },
  };
  return config;
}
