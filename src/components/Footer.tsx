import React, { FC } from "react";
import { Text, Link, Flex, Box, ButtonGroup } from "@chakra-ui/react";
import { ColorModeButton } from "./ColorModeButton";
import { SocialButtons } from "./SocialButtons";

type Props = {
  buildDate?: string;
};

export const Footer: FC<Props> = ({ buildDate }) => {
  return (
    <Flex
      as="footer"
      pt="12"
      pb="8"
      justifyContent="space-between"
      alignItems="center"
      direction={["column", "column", "row"]}
      minW="0"
    >
      <Box pb="4" minW="0">
        <Text pb="4" wordBreak="break-word">
          {`Do you like NFT Tools? Consider donating to the development fund: `}
          <br />
          Ethereum:{" "}
          <Link
            href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_DONATION_ADDRESS}`}
            isExternal
          >
            {process.env.NEXT_PUBLIC_DONATION_ADDRESS}
          </Link>
        </Text>

        {buildDate && (
          <Text pb="2">This page was last updated on {buildDate}</Text>
        )}
      </Box>

      <ButtonGroup spacing="4">
        <ColorModeButton />
        <SocialButtons />
      </ButtonGroup>
    </Flex>
  );
};
