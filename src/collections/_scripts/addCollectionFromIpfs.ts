import "dotenv/config";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import { parseMetadata } from "../_script_utils/parseMetadata";
import { calculateStats } from "../_script_utils/calculateStats";
import { calculateRarityScore } from "../_script_utils/score";
import { saveToFile } from "../_script_utils/saveToFile";
import { FileDbBaseAssetNoId } from "../../types";

// configure new collection
const FOLDER_NAME = "kiwami";
const TOTAL_ITEMS = 10000;
const excludedStatsTraits = [""];
const excludedRarityTraits = [""];

const FOLDER_PATH = path.resolve(__dirname, `../${FOLDER_NAME}`);
const DB_PATH = `${FOLDER_PATH}/db`;
const META_FILE_PATH = `${DB_PATH}/metadata.json`;
const STATS_FILE_PATH = `${DB_PATH}/stats.json`;
const SCORE_FILE_PATH = `${DB_PATH}/score.json`;

type AttributeItem = {
  trait_type: string;
  value: string;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getMetadata = async (id: string): Promise<string | undefined> => {
  console.log(`Fetching for #${id}`);

  try {
    const url = `https://opensea.mypinata.cloud/ipfs/QmaKTpCZsVJingJ1MciEMSnN4MTndz3W8FFT1AMbYAippq/${id}`;
    const responseRaw = await fetch(url);
    const response = await responseRaw.text();
    await sleep(100);
    return response;
  } catch (e: any) {
    console.log(e.message);
  }
};

const formatMetadata = (m: string): FileDbBaseAssetNoId | undefined => {
  if (!m) {
    return;
  }
  const metadata = parseMetadata(m);
  return {
    // name: metadata.name,
    image: metadata.resolvedImage,
    attributes: metadata.attributes.reduce((acc: any, attr: AttributeItem) => {
      return {
        ...acc,
        [attr.trait_type]: attr.value.toString(),
      };
    }, {}),
  };
};

const createFoldersIfNone = () => {
  try {
    fs.accessSync(FOLDER_PATH);
  } catch (err) {
    fs.mkdirSync(FOLDER_PATH);
  }

  try {
    fs.accessSync(DB_PATH);
  } catch (err) {
    fs.mkdirSync(DB_PATH);
  }
};

const existingDb = require(META_FILE_PATH);

const main = async () => {
  createFoldersIfNone();

  const ALL_ITEM_IDS = [...Array(TOTAL_ITEMS).keys()].map((i) => i.toString());

  const db = await ALL_ITEM_IDS.slice(8000, 10000).reduce(
    (promiseChain, id) => {
      return promiseChain.then(async (acc) => {
        const originalMetadata = await getMetadata(id);

        if (originalMetadata) {
          const metadata = formatMetadata(originalMetadata);

          return {
            ...acc,
            [id]: metadata,
          };
        }

        return {
          ...acc,
          [id]: {},
        };
      });
    },
    Promise.resolve({})
  );

  const metadataDb = { ...existingDb, ...db };
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
