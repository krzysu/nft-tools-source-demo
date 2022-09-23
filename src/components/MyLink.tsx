import React, { FC } from "react";
import {
  Link as ChakraLink,
  LinkProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const MyLink: FC<LinkProps> = ({ children, ...props }) => {
  return (
    <ChakraLink color={useColorModeValue("blue.700", "blue.200")} {...props}>
      {children}
      {props.isExternal && <ExternalLinkIcon mx="2px" />}
    </ChakraLink>
  );
};
