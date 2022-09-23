import get from "lodash/get";
import { FILTER_NONE_LABEL } from "../../consts";
import { StatItem } from "../../types";

type DB = Record<string, any>;
type Path = Array<string> | string;
type SortFn = (a: any, b: any) => number;

export const getAllTraitNames = (
  metadataDb: Record<string, any>,
  path: Path
): string[] => {
  const set = Object.values(metadataDb).reduce((set, item) => {
    Object.keys(get(item, path)).forEach((k) => set.add(k));
    return set;
  }, new Set<string>());

  return [...set].sort();
};

// value
const allUniqueValues = (
  metadataDB: DB,
  path: Path,
  sortFn?: SortFn
): string[] => {
  const set = Object.values(metadataDB).reduce((set, item) => {
    set.add(get(item, path));
    return set;
  }, new Set<string>());

  return [...set].sort(sortFn);
};

const filterByValue = (metadataDB: DB, path: Path, value: string) =>
  Object.values(metadataDB).filter((item) => get(item, path) === value);

export const buildStats = (
  metadataDB: DB,
  path: Path,
  sortFn?: SortFn
): StatItem[] => {
  const uniqueValues = allUniqueValues(metadataDB, path, sortFn);

  return uniqueValues.map((value) => {
    const items = filterByValue(metadataDB, path, value);
    return {
      name: typeof value === "undefined" ? FILTER_NONE_LABEL : value.toString(),
      count: items.length,
    };
  });
};

// length
const allUniqueLengths = (metadataDB: DB, path: Path): number[] => {
  const set = Object.values(metadataDB).reduce((set, item) => {
    const objectOrArray = get(item, path);
    set.add(Object.keys(objectOrArray).length);
    return set;
  }, new Set<number>());

  return [...set].sort((a, b) => a - b);
};

const filterByLength = (metadataDB: DB, path: Path, length: number) =>
  Object.values(metadataDB).filter(
    (item) => Object.keys(get(item, path, [])).length === length
  );

export const buildLengthStats = (metadataDB: DB, path: Path): StatItem[] => {
  const lengths = allUniqueLengths(metadataDB, path);

  return lengths.map((length) => {
    const items = filterByLength(metadataDB, path, length);
    return {
      name: length.toString(),
      count: items.length,
    };
  });
};

// array values
const allUniqueArrayValues = (metadataDB: DB, path: Path): string[] => {
  const set = Object.values(metadataDB).reduce((set, item) => {
    get(item, path, []).forEach((value: string) => set.add(value));

    return set;
  }, new Set<string>());

  return [...set].sort();
};

const filterByArrayValue = (metadataDB: DB, path: Path, value: string) =>
  Object.values(metadataDB).filter((item) =>
    get(item, path, []).includes(value)
  );

export const buildArrayStats = (metadataDB: DB, path: Path): StatItem[] => {
  const uniqueArrayValues = allUniqueArrayValues(metadataDB, path);

  return uniqueArrayValues.map((value) => {
    const items = filterByArrayValue(metadataDB, path, value);
    return {
      name: value,
      count: items.length,
    };
  });
};
