import path from "path";
import { calculateStats } from "../../_script_utils/calculateStats";
import { calculateRarityScore } from "../../_script_utils/score";
import { saveToFile } from "../../_script_utils/saveToFile";
import { MetadataDb } from "../../../types";

const excludedStatsTraits = [""];
const excludedRarityTraits = [""];

const PROJECT_ID = "96";

const DB_PATH = path.resolve(__dirname, `../db/${PROJECT_ID}`);
const META_FILE_PATH = `${DB_PATH}/metadata.json`;
const STATS_FILE_PATH = `${DB_PATH}/stats.json`;
const SCORE_FILE_PATH = `${DB_PATH}/score.json`;

const metadataDb = require(META_FILE_PATH) as MetadataDb;

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
