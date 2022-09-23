import React, { FC } from "react";
import {
  Select,
  FormControl,
  FormControlProps,
  FormLabel,
} from "@chakra-ui/react";
import { defaultSortItem, sortItems } from "../../helpers/sort";
import { SortBy } from "../../types";

type Props = {
  value: SortBy;
  onValueChange: (newValue: SortBy) => void;
  withDefault?: boolean;
};

export const SortByItem: FC<Props & FormControlProps> = ({
  value,
  onValueChange,
  withDefault,
  ...rest
}) => {
  const items = withDefault ? [defaultSortItem, ...sortItems] : sortItems;
  return (
    <FormControl display="flex" alignItems="center" w="auto" {...rest}>
      <FormLabel htmlFor="sort" mb="0" whiteSpace="nowrap">
        Sort by
      </FormLabel>
      <Select
        id="sort"
        onChange={(e) => onValueChange(e.target.value as SortBy)}
        value={value}
        variant="filled"
      >
        {items.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
