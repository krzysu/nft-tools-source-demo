import React, { FC } from "react";
import { Box, Image, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { AssetImage } from "./AssetImage";
import { getMarketplaceUrl } from "../helpers-pages/links";
import {
  getMarketplaceLogo,
  getMarketplaceName,
} from "../helpers-pages/marketplaces";
import { formatPrice } from "../helpers-pages/formatter";
import { ApiAsset } from "../types";

type ListItemProps = {
  asset: ApiAsset;
};

export const ListItem: FC<ListItemProps> = ({ asset }) => {
  return (
    <Box position="relative">
      <Box mb="4">
        <NextLink
          href="/asset/[address]/[id]"
          as={`/asset/${asset.collectionSlug}/${asset.tokenId}`}
        >
          <a>
            <AssetImage asset={asset} fallbackProps={{ height: "180px" }} />
          </a>
        </NextLink>
      </Box>

      <Box mb="4">
        <Text
          fontWeight="bold"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          <NextLink
            href="/asset/[address]/[id]"
            as={`/asset/${asset.collectionSlug}/${asset.tokenId}`}
            passHref
          >
            <Link>{asset.name}</Link>
          </NextLink>
        </Text>
      </Box>

      <Box>
        <Flex justify="space-between">
          <Text>Price</Text>
          <Flex alignItems="center">
            {typeof asset.offeredPrice !== "undefined" ? (
              <Link
                href={getMarketplaceUrl(asset, asset.offeredPrice.marketplace)}
                isExternal
                title={getMarketplaceName(asset.offeredPrice.marketplace)}
              >
                <Flex alignItems="center">
                  <Image
                    src={getMarketplaceLogo(asset.offeredPrice.marketplace)}
                    alt={getMarketplaceName(asset.offeredPrice.marketplace)}
                    borderRadius="full"
                    boxSize="22px"
                  />
                  <Text as="span" fontWeight="bold" ml="2">
                    {formatPrice(asset.offeredPrice.value)}
                  </Text>
                </Flex>
              </Link>
            ) : (
              <Text as="span" fontWeight="bold">
                n/a
              </Text>
            )}
          </Flex>
        </Flex>

        {/* <Flex justify="space-between">
          <Text>Last price</Text>
          <Text fontWeight="bold">
            {typeof asset.lastPrice !== "undefined"
              ? formatPrice(asset.lastPrice.value)
              : "n/a"}
          </Text>
        </Flex> */}

        <Flex justify="space-between">
          <Text>Rarity rank</Text>
          <Text fontWeight="bold">{asset.score}</Text>
        </Flex>
      </Box>
    </Box>
  );
};
