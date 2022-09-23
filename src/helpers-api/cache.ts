export interface SimpleInMemoryCache<Type> {
  [index: string]: { value: Type; expiresAtMse: number };
}

const getMseNow = () => new Date().getTime();
const EXPIRATION = 10 * 60; // 10min

export function createCache<Type>({
  defaultSecondsUntilExpiration = EXPIRATION,
}: { defaultSecondsUntilExpiration?: number } = {}) {
  // initialize a fresh in-memory cache object
  const cache: SimpleInMemoryCache<Type> = {};

  // define how to set an item into the cache
  const setCache = (
    key: string,
    value: Type,
    {
      secondsUntilExpiration = defaultSecondsUntilExpiration,
    }: { secondsUntilExpiration?: number } = {}
  ) => {
    const expiresAtMse = getMseNow() + secondsUntilExpiration * 1000;
    cache[key] = { value, expiresAtMse };
  };

  // define how to get an item from the cache
  const getCache = (key: string) => {
    const cacheContent = cache[key];
    if (!cacheContent) return undefined; // if not in cache, then undefined
    if (cacheContent.expiresAtMse < getMseNow()) return undefined; // if already expired, then undefined
    return cacheContent.value; // otherwise, its in the cache and not expired, so return the value
  };

  // return the api
  return { setCache, getCache };
}
