import config from "../collections/config";
import {
  connectToDb,
  disconnectDb,
  findAllInDb,
  findTokensInDb,
} from "./db/pricesDb";
import {
  isArtBlocks,
  removeArtBlocksPrefix,
} from "../collections/artblocks/utils";
import { DbPricedItem } from "../types";

const getQueryAddress = (address: string) => {
  if (isArtBlocks(address)) {
    return removeArtBlocksPrefix(address);
  }

  return config[address].contractAddress;
};

export const fetchPricesFromDb = async (
  address: string
): Promise<DbPricedItem[]> => {
  try {
    const tracking = `PERF: fetchPricesFromDb`;
    console.time(tracking);

    await connectToDb();
    const queryAddress = getQueryAddress(address);
    const data = await findAllInDb(queryAddress);
    await disconnectDb();

    console.timeEnd(tracking);
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchPricesForTokensFromDb = async (
  address: string,
  tokenIds: string[]
): Promise<DbPricedItem[]> => {
  try {
    const tracking = `PERF: fetchPricesForTokensFromDb`;
    console.time(tracking);

    await connectToDb();
    const queryAddress = getQueryAddress(address);
    const data = await findTokensInDb(queryAddress, tokenIds);
    await disconnectDb();

    console.timeEnd(tracking);
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
