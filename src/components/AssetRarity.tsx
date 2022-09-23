import React, { FC } from "react";
import NextLink from "next/link";
import { Box, BoxProps, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { ApiAsset } from "../types";

const SCORE_RANGE = 8;

const buildFilterLinkQuery = (score: number) => {
  const from = score - SCORE_RANGE > 1 ? score - SCORE_RANGE : 1;
  const to = score + SCORE_RANGE;
  return {
    score: [from, to].join("-"),
  };
};

type Props = {
  asset: ApiAsset;
  totalSupply: number;
  pathname: string;
};

export const AssetRarity: FC<Props & BoxProps> = ({
  asset,
  totalSupply,
  pathname,
  ...props
}) => (
  <Box
    borderRadius="xl"
    border="2px"
    borderColor={useColorModeValue("pink.300", "pink.500")}
    _hover={{
      boxShadow: "outline",
    }}
    {...props}
  >
    <NextLink
      href={{
        pathname,
        query: buildFilterLinkQuery(asset.score),
      }}
      passHref
    >
      <Link
        title="similar rarity"
        display="block"
        _hover={{
          textDecoration: "none",
        }}
        _focus={{ outline: "none" }}
      >
        <Box px="4" py="2">
          <Text>Rarity rank</Text>
          <Text fontWeight="bold" fontSize="lg">
            {asset.score}
          </Text>
          <Text>{`out of ${totalSupply}`}</Text>
        </Box>
      </Link>
    </NextLink>
  </Box>
);
