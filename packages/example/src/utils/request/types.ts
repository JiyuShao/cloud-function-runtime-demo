import type nodeFetch from "node-fetch";

export type BFFRequestPayload = {
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: string;
  formUrlencoded?: never;
  formData?: FormData;
  data?: Record<string, any>;
  headers?: Record<string, any>;
  cookies?: Record<string, any>;
};

export type Fetch = typeof nodeFetch | typeof fetch;
export type Sender = ((...args: any[]) => Promise<any>) & {
  fetch?: Fetch;
};

export type RequestCreator = (
  path: string,
  method: string,
  options: {
    origin?: string;
    fetch?: Fetch;
  }
) => Sender;

export type IOptions<F = typeof fetch> = {
  request?: F;
  interceptor?: (request: F) => F;
};
