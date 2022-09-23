import React, { FC } from "react";
import NextLink from "next/link";
import { Box, Flex, Image, Link, useColorModeValue } from "@chakra-ui/react";

export const Header: FC = () => {
  return (
    <Box>
      <Flex
        pt="8"
        pb={["8", null, "16"]}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <NextLink href="/" passHref>
          <Link
            display="block"
            _hover={{
              textDecoration: "none",
            }}
          >
            <Image
              src={useColorModeValue(
                "/logo_icons_light.svg",
                "/logo_icons_dark.svg"
              )}
              alt="NFT Tools"
              h={["56px", "64px", "80px"]}
              title="NFT Tools"
            />
          </Link>
        </NextLink>
      </Flex>
    </Box>
  );
};
