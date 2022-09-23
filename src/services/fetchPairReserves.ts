import Moralis from "moralis";

Moralis.Web3API.initialize({
  apiKey: process.env.MORALIS_API_KEY,
});

// export type Reserves = Awaited<
//   ReturnType<typeof Moralis.Web3API.defi.getPairReserves>
// >;

export type Reserves = {
  reserve0: string;
  reserve1: string;
};

export const fetchPairReserves = async (pairAddress: string) => {
  const tracking = `PERF: fetchPairReserves`;
  console.time(tracking);

  const reserves = await Moralis.Web3API.defi.getPairReserves({
    pair_address: pairAddress,
  });

  console.timeEnd(tracking);
  return reserves;
};
