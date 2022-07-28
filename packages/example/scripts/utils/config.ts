import jsonfile from "jsonfile";
import { resolvePath } from "./path";

const config = {
  /** 当前应用全局唯一 id */
  namespace: "1b671a64-40d5-491e-99b0-da01ff1f3341",
  /** 源文件根目录 */
  cwd: resolvePath(),
  /** api 源文件目录 */
  apiSrcDir: resolvePath('src/api'),
  /** api 文件 pattern */
  apiFilePattern: "src/api/**/*.ts",
};
export default config;

export interface ManifestJson {
  /** 当前应用全局唯一 id */
  namespace: string;
  /** api 文件输出 mapping */
  outputApiFileMapping: Record<string, string>;
}

/**
 * 读取 manifest.json 配置
 * @param {string} path 配置路径
 * @returns {Promise<ManifestJson>}
 */
export const readManifestJson = async (path: string): Promise<ManifestJson> => {
  return jsonfile.readFile(path);
};

/**
 * 写入 manifest.json 配置
 * @param {string} path 配置路径
 * @param {ManifestJson["outputApiFileMapping"]} outputApiFileMapping api 文件输出 mapping
 * @returns
 */
export const writeManifestJson = async (
  path: string,
  manifestJson: ManifestJson
) => {
  return jsonfile.writeFile(path, manifestJson, { spaces: 2 });
};
