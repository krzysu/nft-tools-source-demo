import React, { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import Head from "next/head";
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { Web3ModalButton } from "../../components/Web3ModalButton";
import { ItemListWithSorting } from "../../components/ItemListWithSorting";
import config from "../../collections/config";
import { ApiAsset, ApiWalletResponse, StaticPageCollection } from "../../types";

type Props = {
  collections: StaticPageCollection[];
};

const WalletPage: FC<Props> = ({ collections }) => {
  const router = useRouter();
  const address =
    (typeof router.query.address === "string" &&
      router.query.address.toLowerCase()) ||
    "";

  const { account } = useEthers();
  const [walletAssets, setWalletAssets] = useState<ApiAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          owner: account!,
          address,
        });
        const url = `/api/wallet?${params.toString()}`;
        const response = await fetch(url);
        const data = (await response.json()) as ApiWalletResponse;
        setWalletAssets(data.items);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    };

    if (account && address) {
      run();
    }
  }, [account, address]);

  const handleCollectionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      router.push({
        pathname: router.pathname,
        query: {
          address: e.target.value,
        },
      });
    },
    [router]
  );

  if (isLoading || !collections) {
    return (
      <>
        <Head>
          <title>Wallet</title>
        </Head>
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Spinner thickness="4px" size="xl" />
        </Flex>
      </>
    );
  }

  if (!account) {
    return (
      <>
        <Head>
          <title>Wallet</title>
        </Head>
        <Box mb="12">
          <Heading mb="4">Wallet</Heading>
          <Text fontSize="lg" fontWeight="bold" mb="6">
            Connect wallet to see your assets
          </Text>
          <Web3ModalButton />
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Wallet</title>
      </Head>

      <Box>
        <Box mb="8">
          <Web3ModalButton />
        </Box>
        <ItemListWithSorting
          headingComponent={
            <Flex
              mb={["6", null, "0"]}
              mr={[null, null, "6"]}
              flexDirection={["column", null, "row"]}
              grow={1}
              justifyContent="space-between"
            >
              <Heading
                mb={["6", null, "0"]}
              >{`Wallet (${walletAssets.length})`}</Heading>
              <FormControl
                display="flex"
                alignItems="center"
                w="auto"
                maxW={[null, null, "50%"]}
              >
                <FormLabel htmlFor="sort" mb="0" whiteSpace="nowrap">
                  Collection
                </FormLabel>
                <Select
                  id="sort"
                  onChange={handleCollectionChange}
                  value={address}
                  variant="filled"
                >
                  {collections.map((collection) => (
                    <option key={collection.name} value={collection.slug}>
                      {collection.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          }
          items={walletAssets}
          defaultSortBy="id"
        />
      </Box>
    </>
  );
};

export default WalletPage;

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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
