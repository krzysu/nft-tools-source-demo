import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { ItemList } from "../../components/ItemList";
import { SortByItem } from "../../components/Filters/SortByItem";
import { Filters } from "../../components/Filters";
import { FiltersActive } from "../../components/FiltersActive";
import { getMetaTags } from "../../components/MetaTags";
import {
  queryToAllActiveQueryValues,
  queryToAllFilterValues,
} from "../../helpers/filters";
import {
  ApiAsset,
  ApiCollectionResponse,
  ApiErrorResponse,
  CollectionBase,
  FilterType,
  FilterValues,
  SortBy,
} from "../../types";

const BrowsePage: FC = () => {
  const router = useRouter();
  const address =
    (typeof router.query.address === "string" &&
      router.query.address.toLowerCase()) ||
    "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [collection, setCollection] = useState<CollectionBase>();
  const [assets, setAssets] = useState<ApiAsset[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<FilterType[]>([]);

  const sort = (router.query.sort as SortBy) || "offeredPrice";
  const page = Number(router.query.page as string) || 0;

  const fetchCollection = useCallback(
    async (query: Record<string, string>) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(query);
        params.set("sort", sort);
        params.delete("address");

        const url = `/api/collection/${query.address}?${params.toString()}`;
        const response = await fetch(url);

        if (response.status === 200) {
          const data = (await response.json()) as ApiCollectionResponse;

          setCollection({
            name: data.name,
            description: data.description,
            image: data.image,
          });
          setAssets(data.items);
          setHasMore(data.hasMore);
          setTotal(data.total);
          setFilters(data.filters);
        } else {
          const data = (await response.json()) as ApiErrorResponse;
          setIsError(true);
          setErrorMessage(data.error);
        }
      } catch (e) {
        console.error(e);
        setIsError(true);
        setErrorMessage("Please try again");
      }
      setIsLoading(false);
    },
    [sort]
  );

  useEffect(() => {
    if (router.query.address) {
      fetchCollection(router.query as Record<string, string>);
    }
  }, [router.query, fetchCollection]);

  const filterValues = useMemo(
    () =>
      queryToAllFilterValues(filters, router.query as Record<string, string>),
    [router.query, filters]
  );
  const activeQueryValues = useMemo(
    () =>
      queryToAllActiveQueryValues(
        filters,
        router.query as Record<string, string>
      ),
    [router.query, filters]
  );

  const routerReplace = useCallback(
    (params: {}) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          ...params,
        },
      });
    },
    [router]
  );

  const nextPage = useCallback(() => {
    routerReplace({
      page: Number(page) + 1,
    });
  }, [routerReplace, page]);

  const prevPage = useCallback(() => {
    routerReplace({
      page: Number(page) - 1,
    });
  }, [routerReplace, page]);

  const handleSortByChange = useCallback(
    (newSortBy: SortBy) => {
      routerReplace({
        sort: newSortBy,
        page: 0,
      });
    },
    [routerReplace]
  );

  const handleSubmitFilters = useCallback(
    (filterValues: FilterValues) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...filterValues,
          ...(router.query.sort && { sort: router.query.sort }), // keep sorting
          address,
        },
      });
    },
    [router, address]
  );

  const handleRemoveFilter = useCallback(
    (filterId: string) => {
      const newQuery = { ...router.query };
      delete newQuery[filterId];

      router.replace({
        pathname: router.pathname,
        query: newQuery,
      });
    },
    [router]
  );

  const clearAllFilters = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        address,
      },
    });
  }, [router, address]);

  if (isError) {
    return (
      <>
        <Head>
          <title>Something went wrong</title>
        </Head>
        <Box>
          <Heading mb="2">Something went wrong</Heading>
          <Text fontSize="xl" mb="8">
            {errorMessage}
          </Text>
        </Box>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Spinner thickness="4px" size="xl" />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{collection?.name}</title>
        {getMetaTags({
          title: collection?.name || "",
          description: collection?.description || "",
          image: collection?.image || "",
        })}
      </Head>

      <Box>
        <Heading mb="2">{collection?.name}</Heading>
        <Text mb="8">{collection?.description}</Text>

        <Flex
          justifyContent="space-between"
          alignItems={[null, null, "center"]}
          flexDirection={["column-reverse", null, "row"]}
          pb="4"
        >
          <Text as="div" fontWeight="medium">
            {`Found ${total} items`}
          </Text>

          <Flex
            flexDirection={["column", null, "row"]}
            alignItems={[null, null, "center"]}
          >
            <Box pb={["4", null, "0"]} pr={["0", null, "4"]}>
              <NextLink
                href="/wallet/[address]"
                as={`/wallet/${address}`}
                passHref
              >
                <Button as="a" colorScheme="blue" w={["100%", null, "auto"]}>
                  Wallet
                </Button>
              </NextLink>
            </Box>
            <Box pb={["4", null, "0"]} pr={["0", null, "8"]}>
              <Filters
                filters={filters}
                filterValues={filterValues}
                onSubmit={handleSubmitFilters}
              />
            </Box>
            <Box pb={["4", null, "0"]}>
              <SortByItem value={sort} onValueChange={handleSortByChange} />
            </Box>
          </Flex>
        </Flex>

        <FiltersActive
          filterValues={activeQueryValues}
          onRemove={handleRemoveFilter}
          onRemoveAll={clearAllFilters}
          pb={Object.keys(activeQueryValues).length > 0 ? "8" : "4"}
        />

        <ItemList items={assets} pb="12" />

        <Flex justifyContent="center">
          {page > 0 && (
            <Button onClick={prevPage} mx="3">
              Previous page
            </Button>
          )}
          {hasMore && (
            <Button onClick={nextPage} mx="3">
              Next page
            </Button>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default BrowsePage;
