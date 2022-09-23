import { ParsedUrlQuery } from "querystring";
import {
  ALL_SUPPORTED_MARKETPLACES,
  getMarketplaceName,
} from "../helpers-pages/marketplaces";
import {
  FilterType,
  FilterValues,
  RangeFilterId,
  RangeFilterValue,
  RangeFilterValues,
  RANGE_FILTER_IDS,
} from "../types";

export const DEFAULT_RANGE_FILTER_VALUE = ["", ""] as RangeFilterValue;

export const defaultRangeFilterValues = {
  score: DEFAULT_RANGE_FILTER_VALUE,
  offeredPrice: DEFAULT_RANGE_FILTER_VALUE,
  lastPrice: DEFAULT_RANGE_FILTER_VALUE,
};

export const RANGE_FILTER_ID_TO_LABEL_MAP: Record<string, string> = {
  score: "Rarity rank",
  offeredPrice: "Offered price Ξ",
  lastPrice: "Last price Ξ",
};

export const marketplaceFilter: FilterType = {
  id: "marketplace",
  label: "Marketplace",
  items: ALL_SUPPORTED_MARKETPLACES.map((marketplace) => ({
    value: marketplace,
    label: getMarketplaceName(marketplace),
  })),
};

export const encodeFilters = (label: string) => encodeURI(label);
export const decodeFilters = (label: string) => decodeURI(label);

export const queryToCollectionFilterValues = (
  filtersDb: FilterType[],
  query: ParsedUrlQuery
): FilterValues => {
  const traitFilterIds = filtersDb.map((filter) => filter.id);
  const expectedFilterIds = [...traitFilterIds, "marketplace"];

  return Object.keys(query).reduce((acc, key) => {
    if (!expectedFilterIds.includes(key)) {
      return acc;
    }

    return {
      ...acc,
      [key]: query[key],
    };
  }, {});
};

export const queryToRangeFilterValues = (
  query: ParsedUrlQuery
): RangeFilterValues => {
  const queryFilters = Object.keys(query).reduce((acc, key) => {
    if (!RANGE_FILTER_IDS.includes(key as RangeFilterId)) {
      return acc;
    }

    const value = query[key];

    return {
      ...acc,
      [key]:
        value && typeof value === "string"
          ? value.split("-")
          : DEFAULT_RANGE_FILTER_VALUE,
    };
  }, {});

  return {
    ...defaultRangeFilterValues,
    ...queryFilters,
  };
};

export const queryToAllFilterValues = (
  filters: FilterType[],
  query: Record<string, string>
): FilterValues => {
  const expectedCollectionFilterIds = filters.map((filter) => filter.id);
  const expectedFilterIds = [
    ...expectedCollectionFilterIds,
    ...RANGE_FILTER_IDS,
    "isOffered",
    "marketplace",
  ];

  return Object.keys(query).reduce((acc, key) => {
    if (!expectedFilterIds.includes(key)) {
      return acc;
    }

    return {
      ...acc,
      [key]: query[key],
    };
  }, {});
};

export const queryToAllActiveQueryValues = (
  filters: FilterType[],
  query: Record<string, string>
): FilterValues => {
  const expectedCollectionFilterIds = filters.map((filter) => filter.id);
  const expectedFilterIds = [
    ...expectedCollectionFilterIds,
    ...RANGE_FILTER_IDS,
    "isOffered",
    "marketplace",
    "page",
    "sort",
  ];

  return Object.keys(query).reduce((acc, key) => {
    if (!expectedFilterIds.includes(key)) {
      return acc;
    }

    // special handling of page
    if (key === "page") {
      if (query[key] === "0") {
        return acc;
      }
      if (Number(query[key]) > 0) {
        return {
          ...acc,
          [key]: (Number(query[key]) + 1).toString(),
        };
      }
    }

    return {
      ...acc,
      [key]: query[key],
    };
  }, {});
};
