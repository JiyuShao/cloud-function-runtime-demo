import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import getWebpackConfig from "./utils/webpack.server.config";

const webpackConfig = getWebpackConfig("development");
const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(webpackConfig.devServer, compiler);

const runServer = async () => {
  console.log("Starting server...");
  await server.start();
};

runServer();
