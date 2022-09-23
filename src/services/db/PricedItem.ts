import mongoose from "mongoose";

const pricedItemSchema = new mongoose.Schema({
  address: { type: String, index: true, required: true },
  tokenId: { type: String, required: true },
  marketplace: String,
  lastSale: { price: Number, symbol: String },
  offered: { price: Number, symbol: String },
});

export default mongoose.models.PricedItem ||
  mongoose.model("PricedItem", pricedItemSchema);
