import add from "./add";

/*
 * 后端相关 api 文件，count
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 10:45:10
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-07-28 17:24:23
 */
export default async (...args: number[]) => {
  return add(...args);
};
