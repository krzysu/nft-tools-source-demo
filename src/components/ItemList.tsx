import React, { FC } from "react";
import { Text, SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { ListItem } from "./ListItem";
import { ApiAsset } from "../types";

const sliceMaybe = (list: any[], limit?: number) =>
  limit ? list.slice(0, limit) : list;

type Props = {
  items: ApiAsset[];
  limit?: number;
};

export const ItemList: FC<Props & SimpleGridProps> = ({
  items,
  limit,
  ...rest
}) => {
  return (
    <SimpleGrid columns={[2, 3, 4, 5, 6]} spacing="6" {...rest}>
      {items.length === 0 && <Text fontSize="lg">Nothing found</Text>}
      {sliceMaybe(items, limit).map((asset: ApiAsset) => (
        <ListItem key={asset.tokenId} asset={asset} />
      ))}
    </SimpleGrid>
  );
};
