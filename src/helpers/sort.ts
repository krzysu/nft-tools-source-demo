import { ApiAsset, SortBy } from "../types";

export const _sort = (sortBy?: SortBy) => (a: ApiAsset, b: ApiAsset) => {
  if (sortBy === "id") {
    return Number(a.tokenId) - Number(b.tokenId);
  }
  if (sortBy === "idDesc") {
    return Number(b.tokenId) - Number(a.tokenId);
  }

  if (sortBy === "score") {
    return a.score - b.score;
  }
  if (sortBy === "scoreDesc") {
    return b.score - a.score;
  }

  if (sortBy === "offeredPrice") {
    if (a.offeredPrice && b.offeredPrice) {
      return a.offeredPrice.value - b.offeredPrice.value;
    }
    if (a.offeredPrice && !b.offeredPrice) {
      return -1;
    }
    if (!a.offeredPrice && b.offeredPrice) {
      return 1;
    }
    return 0;
  }

  if (sortBy === "lastPrice") {
    if (a.lastPrice && b.lastPrice) {
      return a.lastPrice.value - b.lastPrice.value;
    }
    if (a.lastPrice && !b.lastPrice) {
      return -1;
    }
    if (!a.lastPrice && b.lastPrice) {
      return 1;
    }
    return 0;
  }

  if (sortBy === "lastPriceDesc") {
    if (a.lastPrice && b.lastPrice) {
      return b.lastPrice.value - a.lastPrice.value;
    }
    if (a.lastPrice && !b.lastPrice) {
      return -1;
    }
    if (!a.lastPrice && b.lastPrice) {
      return 1;
    }
    return 0;
  }

  return 1;
};

export const SORT_VALUE_TO_LABEL_MAP: Record<SortBy, string> = {
  default: "Default",
  id: "#Id",
  idDesc: "#Id DESC",
  score: "Rarity rank",
  scoreDesc: "Rarity rank DESC",
  offeredPrice: "Offered price",
  lastPrice: "Last price",
  lastPriceDesc: "Last price DESC",
};

type SortItem = {
  value: SortBy;
  label: string;
};

export const defaultSortItem: SortItem = {
  value: "default",
  label: SORT_VALUE_TO_LABEL_MAP["default"],
};

const allSortIds = [
  "offeredPrice",
  "id",
  "idDesc",
  "score",
  "scoreDesc",
  // "lastPrice",
  // "lastPriceDesc",
];

export const sortItems: SortItem[] = allSortIds.map((id: string) => {
  const value = id as SortBy;
  return {
    value,
    label: SORT_VALUE_TO_LABEL_MAP[value],
  };
});
