export function getSelects<T>(...selects: (keyof T)[]): string[] {
  return selects as string[];
}

export function mapSelects(alias: string, selects: string[]) {
  return selects.map((s) => `${alias}.${s}`);
}
