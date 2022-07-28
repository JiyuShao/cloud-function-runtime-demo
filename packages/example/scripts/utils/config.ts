import { resolvePath } from "./path";

export default {
  /** 当前应用全局唯一 id */
  namespace: "1b671a64-40d5-491e-99b0-da01ff1f3341",
  /** 源文件根目录 */
  cwd: resolvePath(""),
  /** api 文件 pattern */
  apiFilePattern: "src/api/**/*.ts",
};
