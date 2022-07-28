import path from "path";
import glob from "glob";

/**
 * 根据相对路径获取绝对路径
 * @param {string} relativePath 相对路径
 * @returns {string} 绝对路径
 */
export function resolvePath(relativePath: string) {
  return path.resolve(__dirname, `../../${relativePath}`);
}

/**
 * 获取匹配到的 api
 */
export function getMatchedApiFilePath(cwd: string, apiFilePattern: string) {
  return glob.sync(apiFilePattern, {
    cwd,
    absolute: true,
  });
}
