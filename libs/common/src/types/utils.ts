export type PartialKey<T extends object, Key extends keyof T> = {
  [K in keyof T]: K extends Key ? Partial<T[K]> : T[K];
};
