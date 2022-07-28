import ivm, { Script } from "isolated-vm";

interface CloudFunctionOptions {}
class CloudFunction {
  private options: CloudFunctionOptions;
  private isolate: ivm.Isolate;

  constructor(options: CloudFunctionOptions) {
    this.options = options;
    this.isolate = new ivm.Isolate({ memoryLimit: 8 /* MB */ });
  }

  public createCloudFunction = (
    code: string
  ): ((...args: any[]) => Promise<string>) => {
    const context = this.isolate.createContextSync();
    const global = context.global;
    global.setSync("global", global.derefInto());

    async function runCode(...args: any[]) {
      const fn: any = await context.eval(code, { reference: true });
      return fn.apply(undefined, args, { result: { promise: true } });
    }

    return async (...args: any[]) => {
      return runCode(...args);
    };
  };

  public destory() {
    this.isolate.dispose();
  }
}

export const invokeCloudFunction = async (
  code: string,
  args: any[]
): Promise<string> => {
  let instance: CloudFunction | null = null;
  try {
    instance = new CloudFunction({});
    const func = instance.createCloudFunction(code);
    const result = await func(...args);
    instance.destory();
    return result;
  } catch (error) {
    instance?.destory();
    throw error;
  }
};
