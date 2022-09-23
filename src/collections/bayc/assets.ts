import { getAssets } from "../_shared/getAssets";
import { buildAsset } from "./buildAsset";
import collection from "./config";

import metadataDb from "./db/metadata.json";
import scoreDb from "./db/score.json";

export default getAssets({
  collection,
  metadataDb,
  scoreDb,
  buildAsset,
});
