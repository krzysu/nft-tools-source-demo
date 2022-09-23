import React, { FC } from "react";
import {
  Box,
  Button,
  Flex,
  FlexProps,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  getMarketplaceLogo,
  getMarketplaceName,
} from "../helpers-pages/marketplaces";
import { getMarketplaceUrl } from "../helpers-pages/links";
import { ApiAsset } from "../types";

type Props = {
  asset: ApiAsset;
};

export const AssetOfferedPrice: FC<Props & FlexProps> = ({
  asset,
  ...props
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.500");

  if (!asset.offeredPrice) {
    return null;
  }

  const marketplaceUrl = getMarketplaceUrl(
    asset,
    asset.offeredPrice.marketplace
  );
  const marketplaceName = getMarketplaceName(asset.offeredPrice.marketplace);
  const marketplaceLogo = getMarketplaceLogo(asset.offeredPrice.marketplace);

  return (
    <Flex
      borderRadius="xl"
      border="2px"
      borderColor={borderColor}
      alignItems={[null, null, "center"]}
      flexDirection={["column", null, "row"]}
      flexWrap="wrap"
      px="4"
      py="2"
      {...props}
    >
      <Flex alignItems="center" mr={[null, null, "12"]}>
        <Image
          src={marketplaceLogo}
          alt={marketplaceName}
          borderRadius="full"
          boxSize="50px"
          mr="4"
        />

        <Box>
          <Text>Offered for</Text>
          <Text fontWeight="bold" fontSize="2xl">
            {asset.offeredPrice.value}&nbsp;{asset.offeredPrice.symbol}
          </Text>
        </Box>
      </Flex>

      <Button
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        colorScheme="blue"
        href={marketplaceUrl}
        my="2"
      >
        Buy on {marketplaceName}
        <ExternalLinkIcon ml="2" />
      </Button>
    </Flex>
  );
};
