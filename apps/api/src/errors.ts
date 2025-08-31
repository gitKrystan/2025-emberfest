const ERROR_STATUSES = [
  [400 as const, 'Bad Request' as const] as const,
  [401 as const, 'Unauthorized' as const] as const,
  [402 as const, 'Payment Required' as const] as const,
  [403 as const, 'Forbidden' as const] as const,
  [404 as const, 'Not Found' as const] as const,
  [405 as const, 'Method Not Allowed' as const] as const,
  [406 as const, 'Not Acceptable' as const] as const,
  [407 as const, 'Proxy Authentication Required' as const] as const,
  [408 as const, 'Request Timeout' as const] as const,
  [409 as const, 'Conflict' as const] as const,
  [410 as const, 'Gone' as const] as const,
  [411 as const, 'Length Required' as const] as const,
  [412 as const, 'Precondition Failed' as const] as const,
  [413 as const, 'Payload Too Large' as const] as const,
  [414 as const, 'URI Too Long' as const] as const,
  [415 as const, 'Unsupported Media Type' as const] as const,
  [416 as const, 'Range Not Satisfiable' as const] as const,
  [417 as const, 'Expectation Failed' as const] as const,
  [419 as const, 'Page Expired' as const] as const,
  [420 as const, 'Enhance Your Calm' as const] as const,
  [421 as const, 'Misdirected Request' as const] as const,
  [422 as const, 'Unprocessable Entity' as const] as const,
  [423 as const, 'Locked' as const] as const,
  [424 as const, 'Failed Dependency' as const] as const,
  [425 as const, 'Too Early' as const] as const,
  [426 as const, 'Upgrade Required' as const] as const,
  [428 as const, 'Precondition Required' as const] as const,
  [429 as const, 'Too Many Requests' as const] as const,
  [430 as const, 'Request Header Fields Too Large' as const] as const,
  [431 as const, 'Request Header Fields Too Large' as const] as const,
  [450 as const, 'Blocked By Windows Parental Controls' as const] as const,
  [451 as const, 'Unavailable For Legal Reasons' as const] as const,
  [500 as const, 'Internal Server Error' as const] as const,
  [501 as const, 'Not Implemented' as const] as const,
  [502 as const, 'Bad Gateway' as const] as const,
  [503 as const, 'Service Unavailable' as const] as const,
  [504 as const, 'Gateway Timeout' as const] as const,
  [505 as const, 'HTTP Version Not Supported' as const] as const,
  [506 as const, 'Variant Also Negotiates' as const] as const,
  [507 as const, 'Insufficient Storage' as const] as const,
  [508 as const, 'Loop Detected' as const] as const,
  [509 as const, 'Bandwidth Limit Exceeded' as const] as const,
  [510 as const, 'Not Extended' as const] as const,
  [511 as const, 'Network Authentication Required' as const] as const,
];

export type ErrorStatusCode = (typeof ERROR_STATUSES)[number][0];
export type ErrorStatusText = (typeof ERROR_STATUSES)[number][1];

const ERROR_STATUS_MESSAGE_FOR = new Map(
  ERROR_STATUSES as [ErrorStatusCode, ErrorStatusText][],
);

interface ApiErrorOptions extends ErrorOptions {
  detail: string[];
}

interface BaseApiErrorOptions extends ApiErrorOptions {
  status: ErrorStatusCode;
}

export class BaseApiError extends Error {
  detail: string[];
  status: ErrorStatusCode;

  override name = 'BaseApiError';
  constructor(options: BaseApiErrorOptions) {
    super(ERROR_STATUS_MESSAGE_FOR.get(options.status), options);
    this.detail = options.detail;
    this.status = options.status;
  }
}

export class BadRequestError extends BaseApiError {
  override name = 'BadRequestError';
  constructor(options: ApiErrorOptions) {
    super(Object.assign({}, { status: 400 as const }, options));
  }
}

export class NotFoundError extends BaseApiError {
  override name = 'NotFoundError';
  constructor(options: ApiErrorOptions) {
    super(Object.assign({}, { status: 404 as const }, options));
  }
}

export class UnsupportedMediaTypeError extends BaseApiError {
  override name = 'UnsupportedMediaTypeError';
  constructor(options: ApiErrorOptions) {
    super(Object.assign({}, { status: 415 as const }, options));
  }
}

export class InternalServerError extends BaseApiError {
  override name = 'InternalServerError';
  constructor(options: ApiErrorOptions) {
    super(Object.assign({}, { status: 500 as const }, options));
  }
}
