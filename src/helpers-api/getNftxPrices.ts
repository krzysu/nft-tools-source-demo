import { ethers, BigNumber } from "ethers";
import { fetchNftxVault } from "../services/fetchNftxVault";
import { fetchPairReserves, Reserves } from "../services/fetchPairReserves";
import { buildPriceObj } from "./buildPriceObj";
import { Marketplace, PricesWithTokenInfo } from "../types";

const formatPricesFromNftx = (
  nftxIds: string[],
  price: number
): PricesWithTokenInfo[] => {
  const priceFormatted = Number(price.toFixed(4));

  return nftxIds.map((id) => ({
    tokenId: id,
    offeredPrice: buildPriceObj(priceFormatted, Marketplace.Nftx),
  }));
};

const getPriceFromReserves = (reserves: Reserves, fee: string): number => {
  const reserveEthBN = BigNumber.from(reserves.reserve0);
  const reserveTokenBN = BigNumber.from(reserves.reserve1);

  const sixteenmul = BigNumber.from(1).mul(10).pow(16);
  const amountToBuy = BigNumber.from(100).mul(sixteenmul).add(fee);

  const numerator = reserveEthBN.mul(amountToBuy).mul(1000);
  const denominator = reserveTokenBN.sub(amountToBuy).mul(997);

  const decimals = 18;
  const price = numerator.div(denominator);

  return Number(Number(ethers.utils.formatUnits(price, decimals)).toFixed(4));
};

export const getNftxPrices = async (
  address: string
): Promise<PricesWithTokenInfo[]> => {
  const tracking = `PERF: getNftxPrices`;
  console.time(tracking);

  const vault = await fetchNftxVault(address);

  if (!vault) {
    console.timeEnd(tracking);
    return [];
  }

  const reserves = await fetchPairReserves(vault.lpStakingPool.stakingToken.id);
  const price = getPriceFromReserves(reserves, vault.fees.targetRedeemFee);
  const vaultTokenIds = vault.holdings.map((h) => {
    return h.tokenId;
  });

  const nftxPrices = price ? formatPricesFromNftx(vaultTokenIds, price) : [];

  console.timeEnd(tracking);
  return nftxPrices;
};
