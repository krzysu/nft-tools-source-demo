import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { SortByItem } from "./Filters/SortByItem";
import { ItemList } from "./ItemList";
import { _sort } from "../helpers/sort";
import { ApiAsset, SortBy } from "../types";

type Props = {
  items: ApiAsset[];
  heading?: string;
  headingComponent?: ReactNode;
  limit?: number;
  defaultSortBy?: SortBy;
};

const sortItems = (items: ApiAsset[], sortBy: SortBy): ApiAsset[] => {
  return [...items].sort(_sort(sortBy));
};

export const ItemListWithSorting: FC<Props> = ({
  items,
  heading,
  headingComponent,
  limit,
  defaultSortBy = "default",
}) => {
  const [renderedItems, setRenderedItems] = useState<ApiAsset[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>(defaultSortBy);

  useEffect(() => {
    setRenderedItems(sortItems(items, defaultSortBy));
    setSortBy(defaultSortBy);
  }, [items, defaultSortBy]);

  const handleSortChange = useCallback(
    (newSortBy: SortBy) => {
      const sortedItems = sortItems(items, newSortBy);
      setSortBy(newSortBy);
      setRenderedItems(sortedItems);
    },
    [items]
  );

  return (
    <>
      <Flex
        pb="8"
        flexDirection={["column", null, "row"]}
        justifyContent="space-between"
      >
        {heading && <Heading mb={["6", null, "0"]}>{heading}</Heading>}
        {headingComponent}
        <SortByItem
          value={sortBy}
          onValueChange={handleSortChange}
          withDefault={defaultSortBy === "default"}
        />
      </Flex>
      <ItemList items={renderedItems} limit={limit} />
    </>
  );
};
