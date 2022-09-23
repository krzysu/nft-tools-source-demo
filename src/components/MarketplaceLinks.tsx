import React, { FC } from "react";
import { Image, Flex, Link, Text } from "@chakra-ui/react";
import { ApiAsset, Marketplace } from "../types";
import { getMarketplaceUrl } from "../helpers-pages/links";
import {
  getMarketplaceLogo,
  getMarketplaceName,
} from "../helpers-pages/marketplaces";

type MarketplaceLinkProps = {
  asset: ApiAsset;
  marketplace: Marketplace;
};

const MarketplaceLink: FC<MarketplaceLinkProps> = ({ asset, marketplace }) => {
  const marketplaceUrl = getMarketplaceUrl(asset, marketplace);
  const marketplaceName = getMarketplaceName(marketplace);
  const marketplaceLogo = getMarketplaceLogo(marketplace);

  return (
    <Link
      href={marketplaceUrl}
      isExternal
      title={marketplaceName}
      display="inline-block"
      mr="4"
    >
      <Flex alignItems="center">
        <Image
          src={marketplaceLogo}
          alt={marketplaceName}
          borderRadius="full"
          boxSize="22px"
        />
        <Text as="span" fontWeight="medium" ml="2">
          {marketplaceName}
        </Text>
      </Flex>
    </Link>
  );
};

type Props = {
  asset: ApiAsset;
};

export const MarketplaceLinks: FC<Props> = ({ asset }) => {
  return (
    <Flex justifyContent="flex-start" wrap="wrap">
      <MarketplaceLink asset={asset} marketplace={Marketplace.OpenSea} />
      <MarketplaceLink asset={asset} marketplace={Marketplace.LooksRare} />
      <MarketplaceLink asset={asset} marketplace={Marketplace.X2Y2} />
    </Flex>
  );
};
