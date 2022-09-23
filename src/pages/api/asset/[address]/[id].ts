import type { NextApiRequest, NextApiResponse } from "next";
import config, { getAssets } from "../../../../collections/config";
import { combineAssetsWithPrices } from "../../../../helpers-api/combineAssetsWithPrices";
import { findSimilarAssets } from "../../../../helpers-api/findSimilarAssets";
import { getPrices } from "../../../../helpers-api/getPrices";
import { ApiAssetResponse, ApiErrorResponse } from "../../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiAssetResponse | ApiErrorResponse>
) {
  const address =
    (typeof req.query.address === "string" &&
      req.query.address.toLowerCase()) ||
    "";
  const tokenId = req.query.id as string;

  if (!config[address]) {
    res.status(400).json({
      error: `Collection ${address} is not supported`,
    });
    return;
  }

  const { excludedSimilarTraits, totalSupply } = config[address];
  const assets = getAssets(address)();

  const tempAsset = assets.find((a) => a.tokenId === tokenId);

  if (!tempAsset) {
    res.status(400).json({
      error: `Token with id ${tokenId} not found`,
    });
  }

  try {
    const pricesDb = await getPrices(address);
    const assetsWithPrice = combineAssetsWithPrices(assets, pricesDb);
    const asset = assetsWithPrice.find((a) => a.tokenId === tokenId)!;

    const similarAssets = findSimilarAssets(
      asset,
      assetsWithPrice,
      excludedSimilarTraits
    );

    res.status(200).json({
      asset,
      similarAssets,
      collection: {
        totalSupply,
      },
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({
      error: e.message,
    });
  }
}
