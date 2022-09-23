const getIpfsLink = (link: string): string => {
  if (link.match(/^ipfs:\/\/ipfs\//i)) {
    link = link.substring(12);
  } else if (link.match(/^ipfs:\/\//i)) {
    link = link.substring(7);
  } else {
    console.log("unsupported IPFS format", link);
  }

  return `https:/\/gateway.ipfs.io/ipfs/${link}`;
};

export const parseMetadata = (metadataString?: string): Record<string, any> => {
  const metadata = metadataString ? JSON.parse(metadataString) : {};

  if (metadata.image) {
    const imageUrl = new URL(metadata.image);
    const resolvedImage =
      imageUrl.protocol === "ipfs:"
        ? getIpfsLink(metadata.image)
        : metadata.image;

    return {
      ...metadata,
      resolvedImage,
    };
  }

  return metadata;
};
