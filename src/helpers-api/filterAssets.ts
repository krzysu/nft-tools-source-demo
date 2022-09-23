import { encodeFilters } from "../helpers/filters";
import { _sort } from "../helpers/sort";
import { defaultRangeFilterValues } from "../helpers/filters";
import {
  FILTER_ANY_VALUE,
  FILTER_NONE_VALUE,
  FILTER_SOME_VALUE,
} from "../consts";
import {
  ApiAsset,
  FilterQueryOptions,
  FilterQueryResponse,
  RangeFilterId,
} from "../types";

export const filterAssets = (
  assets: ApiAsset[],
  {
    page = 0,
    limit = 24,
    sort,
    filterValues = {},
    rangeFilterValues = defaultRangeFilterValues,
    isOffered = false,
  }: FilterQueryOptions
): FilterQueryResponse => {
  let base = [...assets]; // clone

  if (isOffered) {
    base = base.filter((asset) => {
      const offeredPrice = asset.offeredPrice?.value || 0;
      return offeredPrice > 0;
    });
  }

  Object.keys(filterValues).forEach((filterId) => {
    if (filterValues[filterId] === FILTER_ANY_VALUE) {
      return;
    }

    base = base.filter((asset) => {
      if (filterId === "marketplace") {
        return asset.offeredPrice?.marketplace === filterValues[filterId];
      }

      if (filterValues[filterId] === FILTER_SOME_VALUE) {
        return asset.traits.some(
          (trait) => encodeFilters(trait.label) === filterId
        );
      }

      if (filterValues[filterId] === FILTER_NONE_VALUE) {
        return !asset.traits.some(
          (trait) => encodeFilters(trait.label) === filterId
        );
      }

      return asset.traits.find(
        (trait) =>
          encodeFilters(trait.label) === filterId &&
          encodeFilters(trait.value) === filterValues[filterId]
      );
    });
  });

  (Object.keys(rangeFilterValues) as RangeFilterId[]).forEach((filterId) => {
    const value = rangeFilterValues[filterId];
    if (value[0] === "" && value[1] === "") {
      return;
    }

    const fromValue = Number(value[0]) || 0;
    const toValue = Number(value[1]) || Infinity;

    base = base.filter((asset) => {
      switch (filterId) {
        case "score":
          const score = asset.score;
          return score >= fromValue && score <= toValue;
        case "offeredPrice":
          const offeredPrice = asset.offeredPrice?.value || 0;
          return offeredPrice > fromValue && offeredPrice <= toValue;
        case "lastPrice":
          const lastPrice = asset.lastPrice?.value || 0;
          return lastPrice > fromValue && lastPrice <= toValue;
        default:
          return true;
      }
    });
  });

  const offset = page * limit;
  const items = base.sort(_sort(sort)).slice(offset, offset + limit);

  return {
    items,
    hasMore: base.length > offset + limit,
    total: base.length,
  };
};
