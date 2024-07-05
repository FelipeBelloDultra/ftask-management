export interface LoggerProvider {
  info(msg: string | object): void;
  error(msg: string | object): void;
  warn(msg: string | object): void;
  debug(msg: string | object): void;
}
