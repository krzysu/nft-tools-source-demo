import { Marketplace } from "../types";

const MARKETPLACE_NAMES = {
  [Marketplace.OpenSea]: "OpenSea",
  [Marketplace.LooksRare]: "LooksRare",
  [Marketplace.X2Y2]: "X2Y2",
  [Marketplace.Nftx]: "NFTX",
  [Marketplace.CryptoPunks]: "CryptoPunks",
};

const MARKETPLACE_LOGOS = {
  [Marketplace.OpenSea]: "/marketplaces/opensea.svg",
  [Marketplace.LooksRare]: "/marketplaces/looksrare.svg",
  [Marketplace.X2Y2]: "/marketplaces/x2y2.svg",
  [Marketplace.Nftx]: "/marketplaces/nftx.svg",
  [Marketplace.CryptoPunks]: "/marketplaces/cryptopunks.svg",
};

export const getMarketplaceName = (marketplace: Marketplace) =>
  MARKETPLACE_NAMES[marketplace];

export const getMarketplaceLogo = (marketplace: Marketplace) =>
  MARKETPLACE_LOGOS[marketplace];

export const ALL_SUPPORTED_MARKETPLACES = [
  Marketplace.OpenSea,
  Marketplace.LooksRare,
  Marketplace.Nftx,
];
