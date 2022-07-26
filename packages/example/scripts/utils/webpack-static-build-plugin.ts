/*
 * webpack插件，在打包前为入口源码添加特殊代码
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 10:12:58
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-07-26 17:55:04
 */
import path from "path";
import Webpack from "webpack";
import minimatch from "minimatch";

const PLUGIN_NAME = "WEBPACK_STATIC_BUILD_PLUGIN";

export interface WebpackStaticBuildPluginOptions {
  /** 匹配根目录 */
  cwd: string;
  /** api 文件匹配规则 */
  apiPattern: string;
}
export default class WebpackStaticBuildPlugin {
  private _options: WebpackStaticBuildPluginOptions;

  constructor(options: WebpackStaticBuildPluginOptions) {
    this._options = options;
  }

  apply(compiler: Webpack.Compiler) {
    const { cwd, apiPattern } = this._options;
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      Webpack.NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(
        PLUGIN_NAME,
        (_loaderContext, normalModule) => {
          // 匹配到 api 目录的话，添加一个新的 loader
          if (!minimatch(normalModule.resource, `${cwd}/${apiPattern}`)) {
            return;
          }
          normalModule.loaders.push({
            loader: path.resolve(__dirname, "./webpack-static-build-loader.js"),
            ident: null,
            type: null,
            options: {
              cwd,
            },
          });
        }
      );
    });
  }
}
