type TBaseResponse = {
  statusCode: number;
  message?: string;
};

export type TSuccessResponse<T = unknown> = TBaseResponse & {
  data?: T;
};

export type TExceptionResponse<T = unknown> = TBaseResponse & {
  error?: T extends unknown ? Record<string, unknown> : T;
};

export type TApiResponse<T = unknown> = Promise<
  TSuccessResponse<T> | TExceptionResponse<T>
>;
