import { getProjectIdFromSlug } from "./utils";
import { getArtBlocksConfig } from "./config";
import { buildAsset } from "./buildAsset";
import { ApiAsset, MetadataDb } from "../../types";

type GetAssets = () => ApiAsset[];

const getArtBlockAssets =
  (slug: string): GetAssets =>
  () => {
    const projectId = getProjectIdFromSlug(slug);
    const metadataDb = require(`./db/${projectId}/metadata.json`) as MetadataDb;
    const scoreDb = require(`./db/${projectId}/score.json`) as Record<
      string,
      number
    >;

    const abConfig = getArtBlocksConfig(projectId);

    const assets = Object.keys(metadataDb).map((id) =>
      buildAsset(metadataDb, scoreDb, abConfig)(id)
    );

    return assets;
  };

export default getArtBlockAssets;
