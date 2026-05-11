export interface HttpErrorResponse<T = unknown> {
  status: number;
  statusText: string;
  data: T;
}

/** Axios-compatible error for existing service catch blocks. */
export class HttpError<T = unknown> extends Error {
  response?: HttpErrorResponse<T>;
  config?: { url?: string; method?: string };
  status?: number;

  constructor(
    message: string,
    response?: HttpErrorResponse<T>,
    config?: { url?: string; method?: string }
  ) {
    super(message);
    this.name = "HttpError";
    this.response = response;
    this.config = config;
    this.status = response?.status;
  }
}

export type { HttpError as AxiosError };
