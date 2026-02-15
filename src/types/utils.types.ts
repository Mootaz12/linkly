export type Constructor<T = any, Arguments extends any[] = any[]> = new (
  ...args: Arguments
) => T;
