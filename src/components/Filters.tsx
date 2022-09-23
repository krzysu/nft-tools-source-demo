import React, { FC, useCallback, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { BooleanItem } from "./Filters/BooleanItem";
import { FilterItem } from "./Filters/FilterItem";
import { RangeFilterItem } from "./Filters/RangeFilterItem";
import { marketplaceFilter } from "../helpers/filters";
import { FILTER_ANY_VALUE } from "../consts";
import { FilterType, FilterValues } from "../types";

const anyItem = {
  value: FILTER_ANY_VALUE,
  label: "Any",
};

type Props = {
  filters: FilterType[];
  filterValues: FilterValues;
  onSubmit: (activeFilters: FilterValues) => void;
};

export const Filters: FC<Props> = ({ filters, filterValues, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeFilters, setActiveFilters] =
    useState<FilterValues>(filterValues);

  const handleFilterChange = useCallback(
    (filterId: string) => (filterValue?: string) => {
      // do not add filters with default value or undefined
      if (filterValue && filterValue !== FILTER_ANY_VALUE) {
        setActiveFilters({
          ...activeFilters,
          [filterId]: filterValue,
        });
      } else {
        const newFilters = {
          ...activeFilters,
        };
        delete newFilters[filterId];
        setActiveFilters(newFilters);
      }
    },
    [activeFilters]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(activeFilters);
    onClose();
  }, [activeFilters, onSubmit, onClose]);

  const handleCancel = useCallback(() => {
    setActiveFilters(filterValues);
    onClose();
  }, [filterValues, onClose]);

  const filtersCount = Object.keys(filterValues).length;

  return (
    <>
      <Button onClick={onOpen} w={["100%", null, "auto"]}>
        {filtersCount > 0 ? `Filters (${filtersCount})` : "Filters"}
      </Button>

      <Drawer isOpen={isOpen} placement="right" size="sm" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontWeight="bold">Filters</DrawerHeader>

          <DrawerBody>
            <Box pb="4">
              <BooleanItem
                isChecked={!!activeFilters["isOffered"]}
                value="isOffered"
                onValueChange={handleFilterChange("isOffered")}
                label="Is offered for sale"
                mb="4"
              />
              <FilterItem
                label={marketplaceFilter.label}
                items={[anyItem, ...marketplaceFilter.items]}
                value={activeFilters[marketplaceFilter.id] || FILTER_ANY_VALUE}
                onValueChange={handleFilterChange(marketplaceFilter.id)}
                isActive={!!activeFilters[marketplaceFilter.id]}
                mb="4"
              />
            </Box>

            <Box pb="4">
              <RangeFilterItem
                key="score"
                label="Rarity rank"
                value={activeFilters["score"]}
                onValueChange={handleFilterChange("score")}
                mb="4"
              />
              <RangeFilterItem
                label="Offered price Ξ"
                value={activeFilters["offeredPrice"]}
                onValueChange={handleFilterChange("offeredPrice")}
                mb="4"
              />
              {/* <RangeFilterItem
                label="Last price Ξ"
                value={activeFilters["lastPrice"]}
                onValueChange={handleFilterChange("lastPrice")}
                mb="4"
              /> */}
            </Box>

            <Box>
              {filters.map((filter) => (
                <FilterItem
                  key={filter.id}
                  label={filter.label}
                  items={[anyItem, ...filter.items]}
                  value={activeFilters[filter.id] || FILTER_ANY_VALUE}
                  onValueChange={handleFilterChange(filter.id)}
                  isActive={!!activeFilters[filter.id]}
                  mb="4"
                />
              ))}
            </Box>
          </DrawerBody>

          <DrawerFooter display="flex" justifyContent="space-between">
            <Button onClick={handleCancel} variant="outline" mr={3}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} colorScheme="blue">
              Apply
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
