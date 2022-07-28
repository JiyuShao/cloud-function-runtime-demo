/*
 * 跨端请求模块
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 14:35:20
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-07-27 10:00:39
 * @Reference https://github.com/modern-js-dev/modern.js/blob/e51b1db382d859e9ecf06d68cec96ef431e020fb/packages/server/create-request/src/index.ts
 */
// import { isBrowser } from "./platform";
import { createRequest as browser } from "./browser";
// import { createRequest as node } from "./node";
import { RequestCreator, IOptions } from "./types";

// const createRequest: RequestCreator = (...args) =>
//   isBrowser() ? browser(...args) : node(...args);
const createRequest: RequestCreator = (...args) => browser(...args);

export declare const configure: (options: IOptions) => void;

export default createRequest;
