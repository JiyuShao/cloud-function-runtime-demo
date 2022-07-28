/*
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 10:52:34
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-07-28 19:02:44
 */
const path = require("path");
const babelParse = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function resolvePath(relativePath = "") {
  return path.resolve(__dirname, `../../${relativePath}`);
}

module.exports = function WebpackStaticBuildLoader(code) {
  try {
    const fileName = this.resourcePath.replace(`${resolvePath("src")}/`, "");
    const { cwd } = this.getOptions() || {};
    if (!cwd) {
      throw new Error("option.cwd 不存在");
    }
    // 解析源码为ast树
    const ast = babelParse.parse(code, {
      allowImportExportEverywhere: true,
      plugins: ["typescript"],
    });

    let hasExportDefaultFunctionFlag = false;

    traverse(ast, {
      // 默认导出钩子，获取默认导出名称
      ExportDefaultDeclaration(path) {
        const { declaration } = path.node;
        if (
          !["FunctionDeclaration", "ArrowFunctionExpression"].includes(
            declaration.type
          )
        ) {
          return;
        }
        hasExportDefaultFunctionFlag = true;
      },
    });

    if (!hasExportDefaultFunctionFlag) {
      throw new Error("格式不正确，没有默认导出函数");
    }

    return `
    import createRequest from "@utils/request";
    export default async (...args: any[]) => {
      return createRequest("/inner-cgi/invokeBFF", "POST", {
        origin: "http://localhost:3000",
      })({
        data: {
          functionName: "${fileName}",
          args,
        },
      }).then((res) => JSON.parse(res).result);
    };
    `;
  } catch (error) {
    console.error("WebpackStaticBuildLoader 解析出错：", {
      path: this.resolvePath,
      error,
    });
  }
};
