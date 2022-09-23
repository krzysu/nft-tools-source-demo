import { encodeFilters } from "../helpers/filters";
import { FILTER_NONE_LABEL, FILTER_NONE_VALUE } from "../consts";
import { FilterType, StatsDB } from "../types";

const allValuesForStatName = (stats: StatsDB, statName: string): string[] =>
  stats[statName].map((i) => i.name);

export const buildFilter = (stats: StatsDB, traitName: string): FilterType => {
  const allValues = allValuesForStatName(stats, traitName);

  return {
    id: encodeFilters(traitName),
    label: traitName,
    items: allValues.map((value) => {
      if (value === FILTER_NONE_LABEL) {
        return {
          value: FILTER_NONE_VALUE,
          label: value,
        };
      }
      return {
        value: encodeFilters(value),
        label: `${value} (${
          stats[traitName].find((v) => v.name === value)?.count
        })`,
      };
    }),
  };
};
