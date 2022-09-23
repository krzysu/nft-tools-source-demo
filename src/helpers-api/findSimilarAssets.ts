import { filterAssets } from "./filterAssets";
import { encodeFilters } from "../helpers/filters";
import { ApiAsset, ApiTrait } from "../types";

export const findSimilarAssets = (
  asset: ApiAsset,
  assets: ApiAsset[],
  excluded: string[] = []
): ApiAsset[] => {
  const traitLabelsByRarity = asset.traits
    .sort((a, b) => a.totalCount - b.totalCount)
    .filter((t: ApiTrait) => !excluded.includes(t.label))
    .map((t) => t.label);

  if (traitLabelsByRarity.length === 0) {
    return [];
  }

  const otherAssets = [...assets].filter((a) => a.tokenId !== asset.tokenId);
  let result = [] as ApiAsset[];
  let i = 4;

  do {
    const traitLabelsToCompare = traitLabelsByRarity.slice(0, i);

    const filterValues = traitLabelsToCompare.reduce((acc, traitLabel) => {
      const filterName = encodeFilters(traitLabel);
      const filterValue =
        asset.traits.find((trait) => trait.label === traitLabel)?.value || "";

      return {
        ...acc,
        [filterName]: encodeFilters(filterValue),
      };
    }, {});

    const filtered = filterAssets(otherAssets, {
      page: 0,
      limit: 30,
      sort: "offeredPrice",
      filterValues,
    });

    result = filtered.items;

    i = i - 1;
  } while (i > 0 && result.length === 0);

  return result;
};
