// types
type AnyObject = { [key: string]: any };
type OmitKeys<T extends AnyObject, K extends keyof T> = Omit<T, K>;
type PickKeys<T extends AnyObject, K extends keyof T> = Pick<T, K>;

export function omitKeys<T extends AnyObject, K extends keyof T>(
  obj: T,
  keysToRemove: K[],
): OmitKeys<T, K> {
  const newObj: Partial<OmitKeys<T, K>> = {};

  for (const key in obj) {
    if (!keysToRemove.includes(key as any)) {
      newObj[key as any] = obj[key];
    }
  }

  return newObj as OmitKeys<T, K>;
}

export function pickKeys<T extends AnyObject, K extends keyof T>(
  obj: T,
  keysToAccept: K[],
): PickKeys<T, K> {
  const newObj: Partial<PickKeys<T, K>> = {};

  for (const key in obj) {
    if (keysToAccept.includes(key as any)) {
      newObj[key as any] = obj[key];
    }
  }

  return newObj as PickKeys<T, K>;
}
