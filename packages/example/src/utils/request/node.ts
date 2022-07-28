import qs from "query-string";
import nodeFetch from "node-fetch";
import { compile, pathToRegexp, Key } from "path-to-regexp";
import { handleRes } from "./handleRes";
import type {
  BFFRequestPayload,
  Sender,
  RequestCreator,
  IOptions,
  Fetch,
} from "./types";

let realRequest: Fetch;
const originFetch = (...params: Parameters<typeof nodeFetch>) =>
  nodeFetch(...params)
    // eslint-disable-next-line promise/prefer-await-to-then
    .then(handleRes);

export const configure = (options: IOptions<typeof nodeFetch>) => {
  const { request, interceptor } = options;
  realRequest = (request as Fetch) || originFetch;
  if (interceptor && !request) {
    realRequest = interceptor(nodeFetch);
  }
};

export const createRequest: RequestCreator = (
  path: string,
  method: string,
  options
) => {
  const { origin = "", fetch = nodeFetch } = options || {};
  const getFinalPath = compile(path, { encode: encodeURIComponent });
  const keys: Key[] = [];
  pathToRegexp(path, keys);

  const sender: Sender = (...args) => {
    const payload: BFFRequestPayload =
      typeof args[args.length - 1] === "object" ? args[args.length - 1] : {};
    payload.params = payload.params || {};
    keys.forEach((key, index) => {
      payload.params![key.name] = args[index];
    });

    const plainPath = getFinalPath(payload.params);
    const finalPath = payload.query
      ? `${plainPath}?${qs.stringify(payload.query)}`
      : plainPath;
    const headers = payload.headers || {};
    let body: any;

    if (payload.data) {
      headers["Content-Type"] = "application/json";
      body =
        typeof payload.data === "object"
          ? JSON.stringify(payload.data)
          : payload.body;
    } else if (payload.body) {
      headers["Content-Type"] = "text/plain";
      // eslint-disable-next-line prefer-destructuring
      body = payload.body;
    } else if (payload.formData) {
      body = payload.formData;
      // https://stackoverflow.com/questions/44919424/bad-content-type-header-no-multipart-boundary-nodejs
      // need multipart boundary auto attached by node-fetch when multipart is true
      // headers['Content-Type'] = 'multipart/form-data';
    } else if (payload.formUrlencoded) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      if (typeof payload.formUrlencoded === "object") {
        body = qs.stringify(payload.formUrlencoded);
      } else {
        body = payload.formUrlencoded;
      }
    }

    const url = `${origin}${finalPath}`;

    const fetcher = realRequest || fetch;

    return fetcher(url, { method, body, headers });
  };

  return sender;
};
