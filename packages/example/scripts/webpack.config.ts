import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default function getWebpackConfig(
  mode: Configuration["mode"]
): Configuration {
  const config: Configuration = {
    mode,
    entry: {
      index: path.resolve(__dirname, "../src/index.ts"),
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
    },
    devServer: {
      port: 3000,
      open: true,
    },
    devtool: "source-map",
    resolve: {
      extensions: [".js", ".ts"],
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
          loader: "ts-loader",
          include: path.resolve(__dirname, "../src"),
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
      }),
    ],
    stats: {
      errorDetails: true,
    },
  };
  return config;
}
