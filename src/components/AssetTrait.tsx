import React, { FC } from "react";
import NextLink from "next/link";
import { Box, BoxProps, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { encodeFilters } from "../helpers/filters";
import { ApiTrait } from "../types";

const buildFilterLinkQuery = (trait: ApiTrait) => {
  const filterName = encodeFilters(trait.label);
  return {
    [filterName]: encodeFilters(trait.value),
  };
};

type Props = {
  trait: ApiTrait;
  pathname: string;
};

export const AssetTrait: FC<Props & BoxProps> = ({
  trait,
  pathname,
  ...props
}) => {
  const boxBg = useColorModeValue("gray.100", "gray.700");

  if (trait.totalCount === 0) {
    // there is no filter for this trait
    return (
      <Box bg={boxBg} borderRadius="xl" px="4" py="2" {...props}>
        <Text>{trait.label}</Text>
        <Text fontWeight="bold" fontSize="lg">
          {trait.value}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={boxBg}
      borderRadius="xl"
      _hover={{
        boxShadow: "outline",
      }}
      {...props}
    >
      <NextLink
        href={{
          pathname,
          query: buildFilterLinkQuery(trait),
        }}
        passHref
      >
        <Link
          display="block"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{ outline: "none" }}
        >
          <Box px="4" py="2">
            <Text>{trait.label}</Text>
            <Text fontWeight="bold" fontSize="lg">
              {trait.value}
            </Text>
            <Text>{`${trait.totalCount} (${trait.totalPercentage}%)`}</Text>
          </Box>
        </Link>
      </NextLink>
    </Box>
  );
};
