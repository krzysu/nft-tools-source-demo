import { Config } from "../../types";
import statsDb from "./db/stats.json";

const CONTRACT_ADDRESS = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

const config: Config = {
  contractAddress: CONTRACT_ADDRESS.toLowerCase(),
  slug: "bayc",
  name: "Bored Ape Yacht Club",
  description: "",
  image:
    "https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130",
  totalSupply: 10000,
  nftxVaultAddress: "0xea47b64e1bfccb773a0420247c0aa0a3c1d2e5c5",
  excludedSimilarTraits: [],
  statsDb,
  category: "premium",
};

export default config;
