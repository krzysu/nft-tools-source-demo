import baycConfig from "./bayc/config";
import { getArtBlocksConfig, AB_PROJECT_IDS } from "./artblocks/config";
import getArtBlockAssets from "./artblocks/assets";
import { isArtBlocks } from "./artblocks/utils";

import { ApiAsset, Config } from "../types";

const config: Record<string, Config> = {
  [baycConfig.slug]: baycConfig,

  // art blocks
  ...AB_PROJECT_IDS.reduce((acc, projectId) => {
    const abConfig = getArtBlocksConfig(projectId);
    return {
      ...acc,
      [abConfig.slug]: abConfig,
    };
  }, {}),
};

export default config;

type GetAssets = () => ApiAsset[];

export const getAssets = (slug: string): GetAssets => {
  if (isArtBlocks(slug)) {
    return getArtBlockAssets(slug);
  }

  const _assets = require(`./${slug}/assets`);
  return _assets ? _assets.default : undefined;
};
