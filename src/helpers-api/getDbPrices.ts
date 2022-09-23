import {
  fetchPricesForTokensFromDb,
  fetchPricesFromDb,
} from "../services/fetchPricesFromDb";
import { buildPriceObj } from "./buildPriceObj";
import { DbPricedItem, PricesWithTokenInfo } from "../types";

const formatDbPrices = (dbPrices: DbPricedItem[]): PricesWithTokenInfo[] => {
  return dbPrices.map((dbPrice) => {
    const hasOfferedPrice = dbPrice.offered && dbPrice.offered.price;
    const hasLastPrice = dbPrice.lastSale && dbPrice.lastSale.price;

    return {
      tokenId: dbPrice.tokenId,
      ...(hasOfferedPrice && {
        offeredPrice: buildPriceObj(
          dbPrice.offered!.price,
          dbPrice.marketplace
        ),
      }),
      ...(hasLastPrice && {
        lastPrice: buildPriceObj(dbPrice.lastSale!.price, dbPrice.marketplace),
      }),
    };
  });
};

export const getDbPrices = async (
  address: string
): Promise<PricesWithTokenInfo[]> => {
  const tracking = `PERF: getDbPrices`;
  console.time(tracking);

  const pricesFromDb = await fetchPricesFromDb(address);
  const prices = formatDbPrices(pricesFromDb);

  console.timeEnd(tracking);
  return prices;
};

export const getDbPricesForTokens = async (
  address: string,
  tokenIds: string[]
): Promise<PricesWithTokenInfo[]> => {
  const pricesFromDb = await fetchPricesForTokensFromDb(address, tokenIds);
  return formatDbPrices(pricesFromDb);
};
