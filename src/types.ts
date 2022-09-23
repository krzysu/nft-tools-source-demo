export type FileDbBaseAsset = {
  id: string;
  name?: string;
  image?: string;
  attributes: Record<string, string>;
};

export type FileDbBaseAssetNoId = Omit<FileDbBaseAsset, "id">;

export type ApiAsset = {
  tokenId: string;
  address: string;
  name: string;
  image: string;
  traits: ApiTrait[];
  collectionName: string;
  collectionSlug: string;
  nftxVaultAddress?: string;
  score: number;
  offeredPrice?: ApiPrice;
  lastPrice?: ApiPrice;
};

export type ApiTrait = {
  label: string;
  value: string;
  totalCount: number;
  totalPercentage: number;
};

export type SortBy =
  | "default"
  | "id"
  | "idDesc"
  | "score"
  | "scoreDesc"
  | "offeredPrice"
  | "lastPrice"
  | "lastPriceDesc";

export type FilterQueryOptions = {
  page?: number;
  limit?: number;
  sort?: SortBy;
  filterValues?: FilterValues;
  rangeFilterValues?: RangeFilterValues;
  isOffered?: boolean;
};

export type FilterQueryResponse = {
  items: ApiAsset[];
  hasMore: boolean;
  total: number;
};

export type FilterValues = Record<string, string>;

export const RANGE_FILTER_IDS = ["score", "offeredPrice", "lastPrice"] as const;
type RangeFilterId_ = typeof RANGE_FILTER_IDS;
export type RangeFilterId = RangeFilterId_[number];
export type RangeFilterValue = [string, string];
export type RangeFilterValues = Record<RangeFilterId, RangeFilterValue>;

export type FilterItem = {
  value: string;
  label: string;
};

export type FilterType = {
  id: string;
  label: string;
  items: FilterItem[];
};

// collection config
export type CollectionBase = {
  name: string;
  description: string;
  image: string;
};

export type CollectionCategory = "partner" | "premium" | "artblocks" | "genart";

export type Config = CollectionBase & {
  slug: string; // folder name
  category?: CollectionCategory;
  contractAddress: string;
  totalSupply: number;
  excludedSimilarTraits?: string[];
  nftxVaultAddress?: string;
  statsDb: StatsDB;
};

// api responses
export type ApiCollectionResponse = CollectionBase & {
  filters: FilterType[];
  items: ApiAsset[];
  hasMore: boolean;
  total: number;
};

export type ApiAssetResponse = {
  asset: ApiAsset;
  similarAssets: ApiAsset[];
  collection: {
    totalSupply: number;
  };
};

export type ApiErrorResponse = {
  error: string;
};

export type ApiWalletResponse = CollectionBase & {
  filters: FilterType[];
  items: ApiAsset[];
};

// prices from a json file
type ItemId = string;
type Offered = number; // only ETH
type LastSale = number; // only ETH
export type PricesJson = Record<ItemId, [Offered, LastSale]>;

// prices from MongoDB
export type DbPrice = {
  price: number;
  symbol: string;
};

export enum Marketplace {
  OpenSea = "opensea",
  LooksRare = "looksrare",
  X2Y2 = "x2y2",
  Nftx = "nftx",
  CryptoPunks = "cryptopunks",
}

export type DbPricedItem = {
  address: string;
  tokenId: string;
  marketplace: Marketplace;
  lastSale?: DbPrice;
  offered?: DbPrice;
};

// aggregated prices
export type ApiPrice = {
  value: number;
  symbol: string;
  marketplace: Marketplace;
};

export type Prices = {
  offeredPrice?: ApiPrice;
  lastPrice?: ApiPrice;
};

export type PricesWithTokenInfo = Prices & {
  tokenId: string;
};

export type PricesDb = Record<string, Prices>;

// stats
export type StatItem = {
  name: string;
  count: number;
};

export type StatsDB = Record<string, StatItem[]>;
export type MetadataDb = Record<string, FileDbBaseAssetNoId>;

// pages
export type StaticPageCollection = {
  name: string;
  image: string;
  slug: string;
  category?: CollectionCategory;
  contractAddress: string;
};

// functions
export type BuildAssetFunc = (
  metadataDb: MetadataDb,
  scoreDb: Record<string, number>,
  collection: Config
) => (id: string) => ApiAsset;
