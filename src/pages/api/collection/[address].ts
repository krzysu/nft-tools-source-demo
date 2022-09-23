import type { NextApiRequest, NextApiResponse } from "next";
import config, { getAssets } from "../../../collections/config";
import {
  queryToCollectionFilterValues,
  queryToRangeFilterValues,
} from "../../../helpers/filters";
import { buildFilters } from "../../../helpers-api/buildFilters";
import { filterAssets } from "../../../helpers-api/filterAssets";
import { getPrices } from "../../../helpers-api/getPrices";
import { combineAssetsWithPrices } from "../../../helpers-api/combineAssetsWithPrices";
import {
  ApiCollectionResponse,
  ApiErrorResponse,
  SortBy,
} from "../../../types";

const DEFAULT_LIMIT = 24;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiCollectionResponse | ApiErrorResponse>
) {
  const address =
    (typeof req.query.address === "string" &&
      req.query.address.toLowerCase()) ||
    "";
  const page = req.query.page ? Number(req.query.page) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_LIMIT;
  const sort = req.query.sort as SortBy | undefined;
  const isOffered = Boolean(Number(req.query.isOffered)) || false;

  if (!config[address]) {
    res.status(400).json({
      error: `Collection ${address} is not supported`,
    });
    return;
  }

  const { name, description, image, statsDb } = config[address];
  const assets = getAssets(address)();

  const tracking1 = `PERF: /api/collection total - ${address}`;
  const tracking2 = `PERF: /api/collection getPrices - ${address}`;
  const tracking3 = `PERF: /api/collection combineAssetsWithPrices - ${address}`;
  const tracking4 = `PERF: /api/collection filterAssets - ${address}`;

  console.time(tracking1);
  const filters = buildFilters(address, statsDb);
  const rangeFilterValues = queryToRangeFilterValues(req.query);
  const filterValues = queryToCollectionFilterValues(filters, req.query);

  console.time(tracking2);
  const pricesDb = await getPrices(address);
  console.timeEnd(tracking2);

  console.time(tracking3);
  const assetsWithPrice = combineAssetsWithPrices(assets, pricesDb);
  console.timeEnd(tracking3);

  console.time(tracking4);
  const filtered = filterAssets(assetsWithPrice, {
    page,
    limit,
    sort,
    filterValues,
    rangeFilterValues,
    isOffered,
  });
  console.timeEnd(tracking4);

  res.status(200).json({
    name,
    description,
    image,
    filters,
    ...filtered,
  });

  console.timeEnd(tracking1);
}
