import { getTraitTotalCount } from "../_script_utils/stats";
import { ApiTrait, FileDbBaseAssetNoId, StatsDB } from "../../types";

const calculateTraitPercentage = (count: number, totalSupply: number) => {
  const percentage = (count / totalSupply) * 100;
  return Number(percentage.toFixed(2));
};

export const buildTraits = (
  item: FileDbBaseAssetNoId,
  statsDb: StatsDB,
  totalSupply: number
): ApiTrait[] => {
  return Object.keys(item.attributes).map((key: string) => {
    const traitCount =
      getTraitTotalCount(statsDb, key, item.attributes[key]) || 0;
    return {
      label: key,
      value: item.attributes[key],
      totalCount: traitCount,
      totalPercentage: calculateTraitPercentage(traitCount, totalSupply),
    };
  });
};
