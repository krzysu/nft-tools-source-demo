import { getNftxPrices } from "./getNftxPrices";
import { getDbPrices, getDbPricesForTokens } from "./getDbPrices";
import { createCache } from "./cache";
import { PricesDb, PricesWithTokenInfo } from "../types";

const pickBestOfferedPrices = (prices: PricesWithTokenInfo[]): PricesDb => {
  const bestPricesMap: Map<string, PricesWithTokenInfo> = prices
    .filter((p) => p.offeredPrice)
    .reduce((unique, price) => {
      const id = price.tokenId;
      const existingPrice = unique.get(id) as PricesWithTokenInfo;

      if (
        !existingPrice ||
        existingPrice.offeredPrice!.value > price.offeredPrice!.value
      ) {
        unique.set(id, price);
      }
      return unique;
    }, new Map());

  const bestPrices = Array.from(bestPricesMap.values());

  return bestPrices.reduce((acc, { tokenId, offeredPrice, lastPrice }) => {
    return {
      ...acc,
      [tokenId]: {
        offeredPrice,
        lastPrice,
      },
    };
  }, {});
};

// const cachedData: Record<string, PricesDb> = {};
const { setCache, getCache } = createCache<PricesDb>();

export const getPrices = async (address: string): Promise<PricesDb> => {
  const cachedData = getCache(address);
  if (cachedData) {
    return cachedData;
  }

  const tracking = `PERF: getPrices`;
  console.time(tracking);

  const externalDataSettled = await Promise.allSettled([
    getNftxPrices(address),
    getDbPrices(address),
  ]);

  const nftxPrices =
    externalDataSettled[0].status === "fulfilled"
      ? externalDataSettled[0].value
      : [];

  const dbPrices =
    externalDataSettled[1].status === "fulfilled"
      ? externalDataSettled[1].value
      : [];

  const tracking2 = `PERF: pickBestOfferedPrices`;
  console.time(tracking2);
  const bestPrices = pickBestOfferedPrices([...nftxPrices, ...dbPrices]);
  console.timeEnd(tracking2);

  setCache(address, bestPrices);
  console.timeEnd(tracking);
  return bestPrices;
};

export const getPricesForTokens = async (
  address: string,
  tokenIds: string[]
): Promise<PricesDb> => {
  const cachedData = getCache(address);
  if (cachedData) {
    return cachedData;
  }

  const dbPrices = await getDbPricesForTokens(address, tokenIds);

  const bestPrices = pickBestOfferedPrices(dbPrices);

  return bestPrices;
};
