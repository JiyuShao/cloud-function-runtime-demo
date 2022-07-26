/*
 * 异步信息共享模块
 * @Author: Jiyu Shao
 * @Date: 2022-07-26 11:44:21
 * @Last Modified by:   Jiyu Shao
 * @Last Modified time: 2022-07-26 11:44:21
 * @Reference https://github.com/modern-js-dev/modern.js/blob/474904e962a8a0afd5dab5525bab4d754254b005/packages/toolkit/utils/src/storage.ts
 */
import * as ah from "async_hooks";

const createStorage = <T>() => {
  let storage: ah.AsyncLocalStorage<any>;

  if (typeof ah.AsyncLocalStorage !== "undefined") {
    storage = new ah.AsyncLocalStorage();
  }

  const run = <O>(context: T, cb: () => O | Promise<O>): Promise<O> => {
    if (!storage) {
      throw new Error(`Unable to use async_hook, please confirm the node version >= 12.17
        `);
    }

    return new Promise<O>((resolve, reject) => {
      storage.run(context, () => {
        try {
          return resolve(cb());
        } catch (error) {
          return reject(error);
        }
      });
    });
  };

  const useContext: () => T = () => {
    if (!storage) {
      throw new Error(`Unable to use async_hook, please confirm the node version >= 12.17
        `);
    }
    const context = storage.getStore();
    if (!context) {
      throw new Error(
        `Can't call useContext out of scope, make sure @modern-js/utils is a single version in node_modules`
      );
    }

    return context;
  };

  return {
    run,
    useContext,
  };
};

export { createStorage };
