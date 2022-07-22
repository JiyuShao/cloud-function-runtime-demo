import ivm, { Script } from "isolated-vm";

interface CloudFunctionOptions {}
class CloudFunction {
  private options: CloudFunctionOptions;
  private isolate: ivm.Isolate;

  constructor(options: CloudFunctionOptions) {
    this.options = options;
    this.isolate = new ivm.Isolate({ memoryLimit: 8 /* MB */ });
  }

  public createCloudFunction = (code: string): ((...args: any[]) => string) => {
    const context = this.isolate.createContextSync();
    const global = context.global;
    global.setSync("global", global.derefInto());

    const script: Script = this.isolate.compileScriptSync(code);
    const cloudFunction = script.runSync(context);
    return (...args: any[]) => {
      return cloudFunction(...args);
    };
  };

  public destory() {
    this.isolate.dispose();
  }
}

export const invokeCloudFunction = (code: string, args: any[]): string => {
  let instance: CloudFunction | null = null;
  try {
    instance = new CloudFunction({});
    const func = instance.createCloudFunction(code);
    return func(...args);
  } catch (error) {
    instance?.destory();
    throw error;
  }
};
