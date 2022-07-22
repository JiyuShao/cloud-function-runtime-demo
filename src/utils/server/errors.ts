class AppError extends Error {
  public code: number;
  public error?: Error;

  constructor(code: number, message: string, error?: Error) {
    super(message);

    this.code = code;
    this.error = error;
  }

  public toModel() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class ServerInitError extends AppError {
  constructor(error?: Error) {
    super(10000, "Server init failed", error);
  }
}

export class NotFoundError extends AppError {
  constructor(error?: Error) {
    super(10001, "Not found", error);
  }
}

export class UnauthorizedError extends AppError {
  constructor(error?: Error) {
    super(10002, "Unauthorized user", error);
  }
}

export class PermissionError extends AppError {
  constructor(error?: Error) {
    super(10003, "Permission denied", error);
  }
}
