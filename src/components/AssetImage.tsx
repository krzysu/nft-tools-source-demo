import React, { FC } from "react";
import {
  Image,
  Spinner,
  Center,
  ImageProps,
  BoxProps,
  CenterProps,
} from "@chakra-ui/react";
import { ApiAsset } from "../types";

type ItemImageProps = ImageProps &
  BoxProps & {
    asset: ApiAsset;
    fallbackProps?: CenterProps;
  };

export const AssetImage: FC<ItemImageProps> = ({
  asset,
  fallbackProps,
  ...rest
}) => {
  return (
    <Image
      src={asset.image}
      alt={asset.name}
      w="100%"
      fallback={
        <Center {...fallbackProps}>
          <Spinner thickness="4px" size="xl" />
        </Center>
      }
      {...rest}
    />
  );
};
