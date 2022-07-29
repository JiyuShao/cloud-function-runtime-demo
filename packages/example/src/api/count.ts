/*
 * 后端相关 api 文件，count
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 10:45:10
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-07-29 14:22:33
 */
import add from "./add";

export default async (...args: number[]) => {
  return add(...args);
};
