
/**
 * ## 概要
 * 配列を指定のキーでグループ化する。
 * lodashのkeyBy相当の役割で使う。
 * 
 * ## 使用例
 * 
 * ```ts
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 3, name: 'Charlie' }
 * ];
 * 
 * // 関数を渡す
 * const result = keyBy(users, (user) => `user-${user.id}`);
 * 
 * console.log(result);
 * // {
 * //   'user-1': { id: 1, name: 'Alice' },
 * //   'user-2': { id: 2, name: 'Bob' },
 * //   'user-3': { id: 3, name: 'Charlie' }
 * // }
 * ```
 * 
 */
export const keyBy = <T, K extends keyof T>(array: T[], iteratee: K | ((item: T) => string)) =>
  array.reduce((result, item) => {
    const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
    if (typeof key !== 'string') {
      throw new Error('keyBy: iteratee must return a string or the key must be a string in the object');
    }
    result[key] = item;
    return result;
  }, {} as Record<string, T>);

/**
 * 指定した値を返す関数を作る。
 * lodashのconstant相当の役割で使う。
 */
export const constant = <T>(value: T) => () => value;

/**
 * ## 概要
 * オブジェクトの各値に関数を適用する。
 * lodashのmapValues相当の役割で使う。
 * 
 * ## 使用例
 *
 * ```ts
 * const users = {
 *   user1: { name: 'Alice', age: 25 },
 *   user2: { name: 'Bob', age: 30 }
 * };
 *
 * const result = mapValues(users, (user) => user.age);
 * console.log(result);
 * // { user1: 25, user2: 30 }
 * ```
 */
export const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T, key: string, obj: Record<string, T>) => U) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key, obj)])
  );

/**
 * オブジェクトから指定したキーを取り除いた新しいオブジェクトを作成する。
 * lodashのomit相当の役割で使う。
 */
export const omit = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<
  T,
  Exclude<keyof T, K>
> =>
  Object.fromEntries(
    Object.entries(
      obj as Record<string, T>
    ).filter(([key]) => !keys.includes(key as K))
  ) as Pick<T, Exclude<keyof T, K>>;

/**
 * ## 概要
 * 任意の値を配列に変換する。
 * lodashのvalues相当の役割で使う。
 * 
 * ## 使用例
 * 
 * ```ts
 * const obj = {
 *  user1: {
 *   name: 'Alice',
 *   age: 25
 *  },
 *  user2: {
 *   name: 'Bob',
 *   age: 30
 *  }
 * };
 * 
 * const result = values(obj);
 * console.log(result);
 * // [
 * //   { name: 'Alice', age: 25 },
 * //   { name: 'Bob', age: 30 }
 * // ]
 * ```
 * 
 */
export function values<T>(collection: T): T extends null | undefined ? [] : Array<T[keyof T]> {
  if (collection == null) {
    return [] as T extends null | undefined ? [] : Array<T[keyof T]>;
  }

  return Object.keys(collection).map((key) => collection[key as keyof T]) as T extends null | undefined
    ? []
    : Array<T[keyof T]>;
}

type Iteratee<T> = ((item: T) => unknown) | keyof T;

/**
 * ## 概要
 * 配列を指定の基準でソートする。
 * lodashのsortBy相当の役割で使う。
 * 
 * ## 使用例
 *  
 * ```ts
 * const users = [
 *  { id: 3, name: 'Charlie' },
 *  { id: 1, name: 'Alice' },
 *  { id: 2, name: 'Bob' }
 * ];
 * 
 * // キー名を渡す
 * const result = sortBy(users, 'id');
 * console.log(result);
 * // [
 * //   { id: 1, name: 'Alice' },
 * //   { id: 2, name: 'Bob' },
 * //   { id: 3, name: 'Charlie' }
 * // ]
 * 
 * // 関数を渡す
 * const result2 = sortBy(users, (user) => user.name);
 * console.log(result2);
 * // [
 * //   { id: 1, name: 'Alice' },
 * //   { id: 2, name: 'Bob' },
 * //   { id: 3, name: 'Charlie' }
 * // ]
 * ```
 * 
 */
export function sortBy<T>(
  collection: T[],
  iteratees: Iteratee<T> | Array<Iteratee<T>>
): T[] {
  // ソート基準が1つだけの場合、配列にラップして扱う
  const iterateesArray = Array.isArray(iteratees) ? iteratees : [iteratees];

  // 元の配列を破壊しないように、スプレッド構文でコピーを作ってから sort する
  return [...collection].sort((a, b) => {
    for (const iteratee of iterateesArray) {
      // iteratee が「関数」の場合は実行し、「キー名」の場合は対応するプロパティ値を取得
      const valA = typeof iteratee === "function" ? iteratee(a) : a[iteratee];
      const valB = typeof iteratee === "function" ? iteratee(b) : b[iteratee];

      // 比較結果が異なるなら、その結果でソート順を決定

      // @ts-ignore
      if (valA < valB) return -1;
      // @ts-ignore
      if (valA > valB) return 1;

      // 同一の場合は次の iteratee を比較
    }

    // すべての比較結果が同じ (valA === valB) だった場合は並びを変えない
    return 0;
  });
}