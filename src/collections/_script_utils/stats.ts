import { StatsDB } from "../../types";

export const getTraitTotalCount = (
  statsDB: StatsDB,
  statName: string,
  value: string
) => {
  if (statsDB[statName]) {
    const statItem = statsDB[statName].find((item) => item.name === value);

    if (statItem) {
      return statItem.count;
    }
  }
};
