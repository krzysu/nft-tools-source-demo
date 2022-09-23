import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis";
import config, { getAssets } from "../../collections/config";
import { getPricesForTokens } from "../../helpers-api/getPrices";
import { combineAssetsWithPrices } from "../../helpers-api/combineAssetsWithPrices";
import { ApiErrorResponse, ApiWalletResponse } from "../../types";

Moralis.Web3API.initialize({
  apiKey: process.env.MORALIS_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiWalletResponse | ApiErrorResponse>
) {
  const address = req.query.address as string;
  const owner = req.query.owner as string;

  if (!config[address]) {
    res.status(400).json({
      error: `Collection ${address} is not supported`,
    });
    return;
  }

  let response = {
    cursor: "",
  } as Awaited<ReturnType<typeof Moralis.Web3API.account.getNFTsForContract>>;
  let tokenIds = [] as string[];

  do {
    response = await Moralis.Web3API.account.getNFTsForContract({
      address: owner,
      token_address: config[address].contractAddress,
      cursor: response.cursor,
    });
    tokenIds = [...tokenIds, ...response.result!.map((item) => item.token_id)];
  } while (
    response.cursor &&
    response.total! > response.page_size! * (response.page! + 1)
  );

  const { name, description, image } = config[address];
  const assets = getAssets(address)();
  const ownerAssets = assets.filter((asset) =>
    tokenIds.includes(asset.tokenId)
  );
  const pricesDb = await getPricesForTokens(address, tokenIds);
  const ownerAssetsWithPrice = combineAssetsWithPrices(ownerAssets, pricesDb);

  res.status(200).json({
    name,
    description,
    image,
    filters: [],
    items: ownerAssetsWithPrice,
  });
}
