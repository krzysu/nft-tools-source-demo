import React, { FC, useMemo } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { NextPage } from "next";
import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import config from "../collections/config";
import { CollectionCategory, StaticPageCollection } from "../types";

type CollectionBoxProps = {
  collection: StaticPageCollection;
};

const CollectionBox: FC<CollectionBoxProps> = ({ collection }) => {
  return (
    <Box
      borderRadius="xl"
      border="2px"
      borderColor={useColorModeValue("gray.200", "gray.500")}
      overflow="hidden"
      _hover={{
        borderColor: useColorModeValue("gray.400", "white"),
      }}
    >
      <NextLink
        href="/browse/[address]"
        as={`/browse/${collection.slug}`}
        passHref
      >
        <Link
          display="block"
          _hover={{
            textDecoration: "none",
          }}
        >
          <Flex alignItems="center">
            <Image
              src={collection.image}
              alt={collection.name}
              boxSize="100px"
              fallback={
                <Center boxSize="100px">
                  <Spinner thickness="4px" size="xl" />
                </Center>
              }
            />
            <Text fontWeight="bold" fontSize="lg" mx="4">
              {collection.name}
            </Text>
          </Flex>
        </Link>
      </NextLink>
    </Box>
  );
};

type IndexCategory = CollectionCategory | "others";

const CATEGORY_HEADLINE_MAP: Record<IndexCategory, string> = {
  partner: "Partner collections",
  premium: "Blue chips",
  artblocks: "ArtBlocks",
  genart: "GEN.ART",
  others: "Experimental", // "Also supported",
};

const CATEGORY_P_MAP: Record<IndexCategory, string> = {
  partner: "Handpicked and supported with special care and quality.",
  premium: "Collections that everybody should know.",
  artblocks: "The best of generative art from ArtBlocks.",
  genart: "The best of generative art from GEN.ART.",
  others: "",
};

type Props = {
  collections: StaticPageCollection[];
};

const Index: FC<NextPage & Props> = ({ collections }) => {
  const collectionsByCategory = useMemo(
    () =>
      collections.reduce((acc, c) => {
        const key = c.category || "others";
        return {
          ...acc,
          [key]: acc[key] ? [...acc[key], c] : [c],
        };
      }, {} as Record<IndexCategory, StaticPageCollection[]>),
    [collections]
  );

  return (
    <>
      <Head>
        <title>NFT Tools v2</title>
      </Head>

      <Box>
        {Object.keys(collectionsByCategory).map((category) => (
          <Box key={category} mb="16">
            <Heading mb="2">
              {CATEGORY_HEADLINE_MAP[category as IndexCategory]}
            </Heading>
            <Text mb="8">{CATEGORY_P_MAP[category as IndexCategory]}</Text>
            <SimpleGrid columns={[1, 1, 2, 3]} spacing="8">
              {collectionsByCategory[category as IndexCategory].map(
                (collection) => (
                  <CollectionBox
                    key={collection.slug}
                    collection={collection}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Index;

export async function getStaticProps() {
  const collections = Object.keys(config).reduce((prevValue, address) => {
    const item = config[address];
    return [
      ...prevValue,
      {
        name: item.name,
        image: item.image,
        slug: item.slug,
        ...(item.category && { category: item.category }),
        contractAddress: item.contractAddress,
      },
    ];
  }, [] as StaticPageCollection[]);

  return {
    props: {
      buildDate: new Date().toUTCString(),
      collections,
    },
  };
}
