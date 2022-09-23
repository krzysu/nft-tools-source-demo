import path from "path";
import { calculateStats } from "../_script_utils/calculateStats";
import { calculateRarityScore } from "../_script_utils/score";
import { saveToFile } from "../_script_utils/saveToFile";
import { FileDbBaseAssetNoId } from "../../types";

const FOLDER_NAME = "hashmasks";
const excludedStatsTraits = [""];
const excludedRarityTraits = [""];

const FOLDER_PATH = path.resolve(__dirname, `../${FOLDER_NAME}`);
const DB_PATH = `${FOLDER_PATH}/db`;
const META_FILE_PATH = `${DB_PATH}/metadata.json`;
const STATS_FILE_PATH = `${DB_PATH}/stats.json`;
const SCORE_FILE_PATH = `${DB_PATH}/score.json`;

const metadataDb = require(META_FILE_PATH) as Record<
  string,
  FileDbBaseAssetNoId
>;

const main = async () => {
  const statsDb = calculateStats(metadataDb, excludedStatsTraits);

  const scoreDb = calculateRarityScore(
    metadataDb,
    statsDb,
    excludedRarityTraits
  );

  saveToFile(statsDb, STATS_FILE_PATH, true);
  saveToFile(scoreDb, SCORE_FILE_PATH, true);
};

main();
