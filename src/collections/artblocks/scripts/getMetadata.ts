import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { saveToFile } from "../../_script_utils/saveToFile";
import { FileDbBaseAsset, MetadataDb } from "../../../types";
import { calculateStats } from "../../_script_utils/calculateStats";
import { calculateRarityScore } from "../../_script_utils/score";

const PROJECT_ID = "37";
const TOTAL_ITEMS = 3000;
const excludedStatsTraits = [""];
const excludedRarityTraits = [""];

const FOLDER_PATH = path.resolve(__dirname, `../db/${PROJECT_ID}`);
const META_FILE_PATH = `${FOLDER_PATH}/metadata.json`;
const STATS_FILE_PATH = `${FOLDER_PATH}/stats.json`;
const SCORE_FILE_PATH = `${FOLDER_PATH}/score.json`;

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

type Response = {
  tokenID: string;
  features: Record<string, string | number>;
};

const getMetaData = async (id: string): Promise<FileDbBaseAsset> => {
  const url = `https://token.artblocks.io/${PROJECT_ID}00${id.padStart(
    4,
    "0"
  )}`;

  try {
    const responseRaw = await fetch(url);
    const response = (await responseRaw.json()) as Response;

    return {
      id: response.tokenID,
      attributes: Object.keys(response.features).reduce((acc, key) => {
        return {
          ...acc,
          [key]: response.features[key].toString(),
        };
      }, {} as Record<string, string>),
    };
  } catch (e) {
    console.log(e);
  }

  return {
    id,
    attributes: {},
  };
};

const ALL_ITEM_IDS = [...Array(TOTAL_ITEMS).keys()].map((i) => i.toString());
const DELAY = 300;

const main = async () => {
  try {
    fs.accessSync(FOLDER_PATH);
  } catch (err) {
    fs.mkdirSync(FOLDER_PATH);
  }

  try {
    fs.accessSync(META_FILE_PATH);
  } catch (err) {
    fs.writeFileSync(META_FILE_PATH, "{}");
  }

  const metadataDB = require(META_FILE_PATH) as MetadataDb;

  const data = await Promise.all(
    // Object.keys(metadataDB)
    //   .filter((id) => Object.keys(metadataDB[id].features).length === 0)
    ALL_ITEM_IDS.map(async (id, index) => {
      await sleep(DELAY * index);
      console.log(`Getting metadata for #${id}`);
      return await getMetaData(id);
    })
  );

  const db = data.reduce((acc, { id, ...assetData }): MetadataDb => {
    return {
      ...acc,
      [id]: assetData,
    };
  }, {});

  const metadataDb = { ...metadataDB, ...db };

  // stats and score
  const statsDb = calculateStats(metadataDb, excludedStatsTraits);

  const scoreDb = calculateRarityScore(
    metadataDb,
    statsDb,
    excludedRarityTraits
  );

  console.log(
    `Collection with ${Object.keys(metadataDb).length} items is ready`
  );

  saveToFile(statsDb, STATS_FILE_PATH, true);
  saveToFile(scoreDb, SCORE_FILE_PATH, true);
  saveToFile(metadataDb, META_FILE_PATH, true);
};

main();
