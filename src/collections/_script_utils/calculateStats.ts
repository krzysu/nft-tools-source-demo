import { buildStats, getAllTraitNames } from "./buildStats";
import { MetadataDb, StatsDB } from "../../types";

export const calculateStats = (
  metadataDb: MetadataDb,
  excludedTraits: string[]
): StatsDB => {
  const traitNames = getAllTraitNames(metadataDb, "attributes").filter(
    (a) => !excludedTraits.includes(a)
  );

  const statsDb = traitNames.reduce((acc, traitName) => {
    return {
      ...acc,
      [traitName]: buildStats(metadataDb, ["attributes", traitName]),
    };
  }, {});

  return statsDb;
};
