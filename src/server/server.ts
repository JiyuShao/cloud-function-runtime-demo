import { Server } from "http";
import Koa from "koa";
import helmet from "koa-helmet";
import { ErrorCallback, retry } from "async";
import * as errors from "./errors";
import router from "./router";

export class AppServer {
  private app: Koa;
  private server?: Server;

  constructor(app: Koa) {
    this.app = app;
  }

  public listen(port: number): Server {
    this.server = this.app.listen(port);
    return this.server;
  }

  public getServer(): Server | undefined {
    return this.server;
  }

  public closeServer(): Promise<void> {
    if (this.server === undefined) {
      throw new errors.ServerInitError();
    }

    const checkPendingRequests = (
      callback: ErrorCallback<Error | undefined>
    ) => {
      this.server?.getConnections(
        (err: Error | null, pendingRequests: number) => {
          if (err) {
            callback(err);
          } else if (pendingRequests > 0) {
            callback(Error(`Number of pending requests: ${pendingRequests}`));
          } else {
            callback(undefined);
          }
        }
      );
    };

    return new Promise<void>((resolve, reject) => {
      retry(
        { times: 10, interval: 1000 },
        checkPendingRequests.bind(this),
        ((error: Error | null | undefined) => {
          if (error) {
            this.server?.close(() => reject(error));
          } else {
            this.server?.close(() => resolve());
          }
        }).bind(this)
      );
    });
  }
}

export function createServer(): AppServer {
  const app = new Koa();
  const appSrv = new AppServer(app);

  // Register Middlewares
  app.use(helmet());

  // Register Router
  app.use(router.routes());
  app.use(router.allowedMethods());

  return appSrv;
}
