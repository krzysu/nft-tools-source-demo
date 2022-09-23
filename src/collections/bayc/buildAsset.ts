import { ApiAsset, Config, MetadataDb } from "../../types";
import { buildTraits } from "../_shared/asset";

export const buildAsset =
  (
    metadataDb: MetadataDb,
    scoreDb: Record<string, number>,
    collection: Config
  ) =>
  (id: string): ApiAsset => {
    const item = metadataDb[id];

    if (!item) {
      throw Error(`Item with id "${id}" not found`);
    }

    return {
      tokenId: id,
      address: collection.contractAddress,
      name: `BAYC #${id}`,
      // image: item.image || "",
      image: `https://img.x2y2.io/image/${encodeURIComponent(
        item.image!
      )}/280-s.png`,
      traits: buildTraits(item, collection.statsDb, collection.totalSupply),
      collectionName: collection.name,
      collectionSlug: collection.slug,
      score: scoreDb[id],
    };
  };
