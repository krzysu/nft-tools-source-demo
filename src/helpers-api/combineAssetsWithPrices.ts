import { ApiAsset, PricesDb } from "../types";

export const combineAssetsWithPrices = (
  assets: ApiAsset[],
  prices: PricesDb
): ApiAsset[] =>
  assets.map((asset) => ({
    ...asset,
    ...prices[asset.tokenId],
  }));
