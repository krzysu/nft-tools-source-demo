import { Marketplace } from "../types";

const SYMBOL_ETH = "ETH";

export const buildPriceObj = (value: number, marketplace: Marketplace) => ({
  value,
  symbol: SYMBOL_ETH,
  marketplace,
});
