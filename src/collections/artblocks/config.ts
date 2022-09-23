import { buildProjectSlug } from "./utils";
import { Config } from "../../types";

const CONTRACT_ADDRESS = "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270";

export const AB_PROJECT_IDS = [13, 23, 12].map((i) => i.toString());

export const getArtBlocksConfig = (projectId: string): Config => {
  const abConfig = require(`./db/${projectId}/config`).default as Config;

  return {
    ...abConfig,
    category: "artblocks",
    contractAddress: CONTRACT_ADDRESS.toLowerCase(),
    slug: buildProjectSlug(projectId),
  };
};
