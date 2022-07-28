import fs from "fs";
import path from "path";
import Router from "@koa/router";
import { invokeCloudFunction } from "../cloud-function";

const router = new Router({
  prefix: "/inner-cgi",
});

router.get("/", async (ctx, next) => {
  ctx.body = "Cloud Function Runtime Service Is Running";
});

router.get("/ping", async (ctx) => {
  ctx.body = "pong";
});

router.get("/status", async (ctx) => {
  ctx.body = "normal";
});

/** 通过传入方法与参数直接进行调用 */
router.post("/invoke", async (ctx) => {
  const { code, args } = ctx.request.body;
  try {
    ctx.body = await invokeCloudFunction(code, args);
  } catch (error) {
    console.error("invoke failed", error);
  }
});

/** 通过传入 */
router.post("/invokeBFF", async (ctx) => {
  const { functionName, args } = ctx.request.body;
  try {
    const apiDistDir = path.resolve(
      __dirname,
      "../../../../example/dist/server"
    );
    const manifestJsonString = fs.readFileSync(
      path.resolve(apiDistDir, "manifest.json"),
      { encoding: "utf8" }
    );
    const manifestJson = JSON.parse(manifestJsonString);
    const code = fs.readFileSync(
      path.resolve(apiDistDir, manifestJson.outputApiFileMapping[functionName]),
      {
        encoding: "utf8",
      }
    );
    const result = await invokeCloudFunction(
      `
      var module = { exports: {} };
      ((module) => {
        ${code}
      })(module);
      module.exports;
      `,
      args
    );
    ctx.body = JSON.stringify({ result });
  } catch (error) {
    console.error("invokeBFF failed", error);
  }
});

export default router;
