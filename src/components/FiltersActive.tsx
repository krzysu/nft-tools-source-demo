import React, { FC, useCallback } from "react";
import {
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  WrapProps,
  Link,
} from "@chakra-ui/react";
import {
  decodeFilters,
  RANGE_FILTER_ID_TO_LABEL_MAP,
} from "../helpers/filters";
import { SORT_VALUE_TO_LABEL_MAP } from "../helpers/sort";
import { getMarketplaceName } from "../helpers-pages/marketplaces";
import { FilterValues, Marketplace, SortBy } from "../types";

type Props = {
  filterValues: FilterValues;
  onRemove: (filterId: string) => void;
  onRemoveAll: () => void;
};

const formatActiveFilter = (filterValues: FilterValues, filterId: string) => {
  if (filterId === "sort") {
    return `Sort by: ${
      SORT_VALUE_TO_LABEL_MAP[filterValues[filterId] as SortBy]
    }`;
  }

  if (["score", "offeredPrice", "lastPrice"].includes(filterId)) {
    const value = filterValues[filterId].split("-");
    const from = value[0] ? `from ${value[0]}` : "";
    const to = value[1] ? `to ${value[1]}` : "";
    return `${RANGE_FILTER_ID_TO_LABEL_MAP[filterId]}: ${from} ${to}`;
  }

  if (filterId === "isOffered") {
    return "Is offered for sale";
  }

  if (filterId === "page") {
    return `Page: ${filterValues[filterId]}`;
  }

  if (filterId === "marketplace") {
    return `Marketplace: ${getMarketplaceName(
      filterValues[filterId] as Marketplace
    )}`;
  }

  return `${decodeFilters(filterId)}: ${decodeFilters(filterValues[filterId])}`;
};

export const FiltersActive: FC<WrapProps & Props> = ({
  filterValues,
  onRemove,
  onRemoveAll,
  ...rest
}) => {
  const handleClick = useCallback(
    (filterId: string) => () => {
      onRemove(filterId);
    },
    [onRemove]
  );

  return (
    <Wrap align="center" {...rest}>
      {Object.keys(filterValues).map((filterId) => (
        <WrapItem key={filterId}>
          <Tag
            variant="subtle"
            size="lg"
            colorScheme="gray"
            borderRadius="full"
          >
            <TagLabel>{formatActiveFilter(filterValues, filterId)}</TagLabel>
            <TagCloseButton onClick={handleClick(filterId)} />
          </Tag>
        </WrapItem>
      ))}
      {Object.keys(filterValues).length > 0 && (
        <WrapItem>
          <Link onClick={onRemoveAll} textDecoration="underline">
            Clear all
          </Link>
        </WrapItem>
      )}
    </Wrap>
  );
};
