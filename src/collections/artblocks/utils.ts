const invert = (obj: Record<string, string>) => {
  return Object.keys(obj).reduce((ret, key) => {
    const value = obj[key];
    ret[value] = key;
    return ret;
  }, {} as Record<string, string>);
};

const PROJECT_ID_TO_SLUG: Record<string, string> = {
  12: "unigrids-by-zeblocks",
  13: "ringers-by-dmitri-cherniak",
  23: "archetype-by-kjetil-golid",
  37: "paper-armada-by-kjetil-golid",
  40: "algobots-by-stina-jones",
  53: "subscapes-by-matt-deslauriers",
  64: "algorhythms-by-han-x-nicolas-daniel",
  78: "fidenza-by-tyler-hobbs",
  96: "gravity-12-by-jimmy-herdberg",
};

const SLUG_TO_PROJECT_ID = invert(PROJECT_ID_TO_SLUG);

const AB_PREFIX = "artblocks-";

export const buildProjectSlug = (projectId: string) =>
  `${AB_PREFIX}${PROJECT_ID_TO_SLUG[projectId]}`;

export const removeArtBlocksPrefix = (slug: string) =>
  slug.replace(AB_PREFIX, "");

export const isArtBlocks = (slug: string) => slug.startsWith(AB_PREFIX);

export const getProjectIdFromSlug = (slug: string) =>
  SLUG_TO_PROJECT_ID[slug.replace(AB_PREFIX, "")];
