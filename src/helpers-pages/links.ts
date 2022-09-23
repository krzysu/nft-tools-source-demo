import { ApiAsset, Marketplace } from "../types";

export const getOpenSeaUrl = (asset: ApiAsset, network: string = "") =>
  `https://opensea.io/assets/${network ? `${network}/` : ""}${asset.address}/${
    asset.tokenId
  }?ref=${process.env.NEXT_PUBLIC_OPEN_SEA_REF_ADDRESS}`;

export const getLooksRareUrl = (asset: ApiAsset) =>
  `https://looksrare.org/collections/${asset.address}/${asset.tokenId}`;

export const getX2Y2Url = (asset: ApiAsset) =>
  `https://x2y2.io/eth/${asset.address}/${asset.tokenId}`;

export const getNftxUrl = (asset: ApiAsset) =>
  asset.nftxVaultAddress
    ? `https://nftx.io/vault/${asset.nftxVaultAddress}/buy`
    : "";

export const getCryptoPunksUrl = (asset: ApiAsset) =>
  `https://www.larvalabs.com/cryptopunks/details/${asset.tokenId}`;

export const getMarketplaceUrl = (
  asset: ApiAsset,
  marketplace: Marketplace
): string | undefined => {
  if (marketplace === Marketplace.OpenSea) {
    return getOpenSeaUrl(asset);
  }
  if (marketplace === Marketplace.LooksRare) {
    return getLooksRareUrl(asset);
  }
  if (marketplace === Marketplace.X2Y2) {
    return getX2Y2Url(asset);
  }
  if (marketplace === Marketplace.Nftx) {
    return getNftxUrl(asset);
  }
  if (marketplace === Marketplace.CryptoPunks) {
    return getCryptoPunksUrl(asset);
  }
};
