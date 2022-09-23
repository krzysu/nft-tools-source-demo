import { buildFilter } from "./buildFilter";
import { FilterType, StatsDB } from "../types";

const cachedData: Record<string, FilterType[]> = {};

export const buildFilters = (
  address: string,
  statsDb: StatsDB
): FilterType[] => {
  if (cachedData[address]) {
    return cachedData[address];
  }

  const allTraits = Object.keys(statsDb);

  const filters = allTraits.map((traitName: string) => {
    return buildFilter(statsDb, traitName);
  });

  cachedData[address] = filters;

  return filters;
};
