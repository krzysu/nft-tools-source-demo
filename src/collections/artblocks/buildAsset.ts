import { buildTraits } from "../_shared/asset";
import { ApiAsset, Config, MetadataDb } from "../../types";

const buildImageUrl = (id: string) => `https://api.artblocks.io/image/${id}`;

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
      name: `#${Number(id.slice(-4))}`,
      image: buildImageUrl(id),
      traits: buildTraits(item, collection.statsDb, collection.totalSupply),
      collectionName: collection.name,
      collectionSlug: collection.slug,
      score: scoreDb[id],
    };
  };
