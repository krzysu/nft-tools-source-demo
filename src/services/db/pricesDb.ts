import mongoose from "mongoose";
import PricedItem from "./PricedItem";
import { DbPricedItem } from "../../types";

export const connectToDb = async () => {
  await mongoose.connect(process.env.DATABASE_ENDPOINT!);
};

export const disconnectDb = async () => {
  await mongoose.connection.close();
};

export const findAllInDb = async (address: string): Promise<DbPricedItem[]> => {
  const tracking = `PERF: pricesDb.findAllInDb`;
  console.time(tracking);

  const items = await PricedItem.find({ address }).exec();

  console.timeEnd(tracking);
  return items;
};

export const findTokensInDb = async (
  address: string,
  tokenIds: string[]
): Promise<DbPricedItem[]> => {
  const tracking = `PERF: pricesDb.findTokensInDb`;
  console.time(tracking);

  const query = PricedItem.find({ address });
  query.find({ tokenId: { $in: tokenIds } });
  const items = await query.exec();

  console.timeEnd(tracking);
  return items;
};
