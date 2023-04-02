/**
 * @description 专门用于设置缓存的Map，允许设置最大缓存size，并使用LRU策略替换缓存内容
 */
export class CacheMap<Key, Value> extends Map<Key, Value> {
  private keyList = [] as Key[];
  readonly maxSize: number;
  private cleanUp?: ((key: Key, val: Value) => void);
  private keyEquals: (k1: Key, k2: Key) => boolean;
  constructor(option?: { maxSize: number, cleanUp?: (key: Key, value: Value) => void, keyEquals?: (k1: Key, k2: Key) => boolean }) {
    super();
    this.maxSize = option?.maxSize ?? Infinity;
    this.cleanUp = option?.cleanUp;
    this.keyEquals = option?.keyEquals ?? ((k1, k2) => k1 === k2);
  }

  private shouldCleanKey(newKey: Key) {
    const deletedKey = (() => {
      // 对于重复的Key，即使未超出长度也需要执行清理
      if (this.keyList.some((key) => this.keyEquals(key, newKey))) {
        this.keyList = this.keyList.filter((key) => !this.keyEquals(key, newKey));
        this.keyList.push(newKey);
        return newKey;
      }
      this.keyList.push(newKey);
      if (this.keyList.length > this.maxSize) {
        return this.keyList.shift();
      }
      return undefined;
    })();
    if (deletedKey) {
      const oldValue = this.get(deletedKey)!;
      this.delete(deletedKey);
      this.cleanUp?.(deletedKey, oldValue);
    }
  }

  set(key: Key, value: Value): this {
    this.shouldCleanKey(key);
    super.set(key, value);
    return this;
  }

  clear(): void {
    this.forEach((value, key) => {
      this.cleanUp?.(key, value);
    });
    super.clear();
  }
}
