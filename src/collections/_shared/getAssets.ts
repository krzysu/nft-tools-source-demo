import { ApiAsset, BuildAssetFunc, Config } from "../../types";

const assets: Record<string, ApiAsset[]> = {};

type Props = {
  collection: Config;
  metadataDb: Record<string, any>;
  scoreDb: Record<string, number>;
  buildAsset: BuildAssetFunc;
};

export const getAssets =
  ({ collection, metadataDb, scoreDb, buildAsset }: Props) =>
  () => {
    const tracking = `PERF: getAssets - ${
      collection.slug || collection.contractAddress
    }`;
    console.time(tracking);

    if (assets[collection.contractAddress]) {
      console.timeEnd(tracking);
      return assets[collection.contractAddress];
    }

    const allAssets = Object.keys(metadataDb).map((id) =>
      buildAsset(metadataDb, scoreDb, collection)(id)
    );

    assets[collection.contractAddress] = allAssets;
    console.timeEnd(tracking);
    return allAssets;
  };
