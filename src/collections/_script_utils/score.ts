import { getTraitTotalCount } from "./stats";
import { FileDbBaseAssetNoId, StatsDB } from "../../types";

// [Rarity Score for a Trait Value] = 1 / ([Number of Items with that Trait Value] / [Total Number of Items in Collection])
const rarityOfTrait = (traitTotalCount: number, totalItems: number) =>
  1 / (traitTotalCount / totalItems);

const getCalculateItemScoreFunc =
  (statsDb: StatsDB, totalSupply: number, excludedTraits: string[] = []) =>
  (item: FileDbBaseAssetNoId): number => {
    // exclude certain attributes from score
    const allScores = Object.keys(item.attributes)
      .filter((a) => !excludedTraits.includes(a))
      .map((traitName) =>
        rarityOfTrait(
          getTraitTotalCount(statsDb, traitName, item.attributes[traitName]) ||
            0,
          totalSupply
        )
      )
      .filter((score) => score > 0);

    const avgTraitsScore = allScores.reduce((acc, score) => acc + score, 0);

    return -1 * avgTraitsScore;
  };

export const calculateRarityScore = (
  metadataDb: Record<string, any>,
  statsDb: StatsDB,
  excludedTraits?: string[]
): Record<string, number> => {
  const totalSupply = Object.keys(metadataDb).length;

  const calculateItemScore = getCalculateItemScoreFunc(
    statsDb,
    totalSupply,
    excludedTraits
  );

  const scores = Object.keys(metadataDb)
    .map((id) => ({
      id,
      score: calculateItemScore(metadataDb[id]),
    }))
    .sort((a, b) => {
      return a.score - b.score;
    });

  return scores.reduce((acc, i, index) => {
    return {
      ...acc,
      [i.id]: index + 1,
    };
  }, {});
};
