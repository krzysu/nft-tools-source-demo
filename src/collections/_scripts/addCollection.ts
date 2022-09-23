import "dotenv/config";
import path from "path";
import fs from "fs";
import Moralis from "moralis";
import fetch from "node-fetch";
import { parseMetadata } from "../_script_utils/parseMetadata";
import { calculateStats } from "../_script_utils/calculateStats";
import { calculateRarityScore } from "../_script_utils/score";
import { saveToFile } from "../_script_utils/saveToFile";
import { FileDbBaseAssetNoId } from "../../types";

// configure new collection
const FOLDER_NAME = "bullsontheblock";
const CONTRACT_ADDRESS = "0x3a8778a58993ba4b941f85684d74750043a4bb5f";
const excludedStatsTraits = [""];
const excludedRarityTraits = [""];

const FOLDER_PATH = path.resolve(__dirname, `../${FOLDER_NAME}`);
const DB_PATH = `${FOLDER_PATH}/db`;
const META_FILE_PATH = `${DB_PATH}/metadata.json`;
const STATS_FILE_PATH = `${DB_PATH}/stats.json`;
const SCORE_FILE_PATH = `${DB_PATH}/score.json`;

type MoralisNft = {
  token_address: string;
  token_id: string;
  contract_type: string;
  token_uri?: string;
  metadata?: string;
  synced_at?: string;
  amount?: string;
  name: string;
  symbol: string;
};

type MoralisResponseWithCursor = {
  cursor: string;
};

type AttributeItem = {
  trait_type: string;
  value: string;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getMetadata = async (item: MoralisNft): Promise<string | undefined> => {
  if (item.metadata) {
    return item.metadata;
  }

  if (item.token_uri) {
    console.log(
      `Item ${item.token_id} is missing metadata, fetching from ${item.token_uri}`
    );

    // get metadata from token_uri
    try {
      const responseRaw = await fetch(item.token_uri);
      const response = await responseRaw.text();
      await sleep(500);
      return response;
    } catch (e: any) {
      console.log(e.message);
    }
  }
};

const formatMetadata = (
  m: string,
  id: string
): FileDbBaseAssetNoId | undefined => {
  if (!m) {
    return;
  }
  const metadata = parseMetadata(m);

  return {
    // name: metadata.name,
    image: metadata.resolvedImage,
    attributes: metadata.attributes.reduce((acc: any, attr: AttributeItem) => {
      if (!attr.value) {
        console.log(attr, id);

        return {
          ...acc,
          ...attr,
        };
      }

      return {
        ...acc,
        [attr.trait_type]: attr.value.toString(),
      };
    }, {}),
  };
};

type SingleCallResponse = {
  nextCursor: string;
  metadata: Record<string, any>;
};

const singleCall = async (cursor: string): Promise<SingleCallResponse> => {
  const _response = await Moralis.Web3API.token.getAllTokenIds({
    address: CONTRACT_ADDRESS,
    ...(cursor ? { cursor } : {}),
  });
  const response = _response as typeof _response & MoralisResponseWithCursor;

  if (response.result) {
    const metadataDb = await response.result.reduce((promiseChain, item) => {
      return promiseChain.then(async (acc) => {
        const originalMetadata = await getMetadata(item);

        if (originalMetadata) {
          const metadata = formatMetadata(originalMetadata, item.token_id);

          return {
            ...acc,
            [item.token_id]: metadata,
          };
        }

        return acc;
      });
    }, Promise.resolve({}));

    return {
      nextCursor: response.cursor,
      metadata: metadataDb,
    };
  }

  return {
    nextCursor: "",
    metadata: {},
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

const main = async () => {
  Moralis.Web3API.initialize({
    apiKey: process.env.MORALIS_API_KEY,
  });

  createFoldersIfNone();

  let hasNextPage = false;
  let cursor = "";
  let metadataDb = {};

  do {
    console.log(`cursor ${cursor}`);
    const { nextCursor, metadata } = await singleCall(cursor);
    cursor = nextCursor;
    metadataDb = { ...metadataDb, ...metadata };
    hasNextPage = !!nextCursor;
  } while (hasNextPage);

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
