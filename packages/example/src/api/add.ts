/*
 * 后端相关 api 文件，add
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 10:45:10
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-07-28 17:25:09
 */
export default async (...args: number[]) => {
  return args.reduce((prev, current) => prev + current, 0);
};
