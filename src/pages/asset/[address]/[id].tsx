import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Flex, Link, Heading, Text, Spinner } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AssetImage } from "../../../components/AssetImage";
import { AssetOfferedPrice } from "../../../components/AssetOfferedPrice";
import { AssetRarity } from "../../../components/AssetRarity";
import { AssetTrait } from "../../../components/AssetTrait";
import { MarketplaceLinks } from "../../../components/MarketplaceLinks";
import { ItemListWithSorting } from "../../../components/ItemListWithSorting";
import { ApiAsset, ApiAssetResponse } from "../../../types";

const AssetPage: FC = () => {
  const router = useRouter();
  const { address, id } = router.query;
  const [asset, setAsset] = useState<ApiAsset>();
  const [similarAssets, setSimilarAssets] = useState<ApiAsset[]>([]);
  const [collection, setCollection] = useState<any>({});

  useEffect(() => {
    const run = async () => {
      try {
        const url = `/api/asset/${address}/${id}`;
        const response = await fetch(url);
        const data = (await response.json()) as ApiAssetResponse;
        setAsset(data.asset);
        setSimilarAssets(data.similarAssets);
        setCollection(data.collection);
      } catch (e) {
        console.error(e);
      }
    };

    if (address && id) {
      run();
    }
  }, [address, id]);

  if (!asset) {
    return (
      <Flex justifyContent="center" alignItems="center" height="300px">
        <Spinner thickness="4px" size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>{asset.name}</title>
      </Head>

      <Box>
        <Flex direction={["column", null, "row"]} mb="12">
          <Box
            mb={["4", null, "0"]}
            mr={["auto", "auto", "8", "16"]}
            maxW={["100%", null, "40%"]}
            minW={[null, null, "300px"]}
          >
            <AssetImage
              asset={asset}
              width="100%"
              maxW="100%"
              fallbackProps={{
                width: "320px",
                flexShrink: 0,
                height: "320px",
              }}
              flexShrink={0}
            />
          </Box>

          <Box>
            <Heading mb="2">{asset.name}</Heading>
            <Box mb="8">
              <NextLink
                href="/browse/[address]"
                as={`/browse/${asset.collectionSlug}`}
                passHref
              >
                <Link display="inline-flex" alignItems="center">
                  <ArrowBackIcon boxSize={6} mr="2" />
                  <Text as="span" fontWeight="medium" fontSize="lg">
                    {asset.collectionName}
                  </Text>
                </Link>
              </NextLink>
            </Box>

            <Box mb="10">
              <MarketplaceLinks asset={asset} />
            </Box>

            <Flex>
              <AssetOfferedPrice asset={asset} mb="10" />
            </Flex>

            <Flex justifyContent="flex-start" wrap="wrap">
              <AssetRarity
                asset={asset}
                totalSupply={collection.totalSupply}
                pathname={`/browse/${asset.collectionSlug}`}
                mr="4"
                mb="4"
              />

              {asset.traits.map((trait) => (
                <AssetTrait
                  key={trait.label}
                  trait={trait}
                  pathname={`/browse/${asset.collectionSlug}`}
                  mr="4"
                  mb="4"
                />
              ))}
            </Flex>
          </Box>
        </Flex>

        {similarAssets.length > 0 && (
          <Box mb="12">
            <ItemListWithSorting
              heading={`Similar items (${similarAssets.length})`}
              items={similarAssets}
              limit={12}
              defaultSortBy="offeredPrice"
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default AssetPage;
