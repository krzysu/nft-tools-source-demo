import React, { FC } from "react";
import { IconButton, Icon } from "@chakra-ui/react";
import { RiDiscordFill, RiTwitterFill } from "react-icons/ri";

export const SocialButtons: FC = () => (
  <>
    {/* <IconButton
      as={"a"}
      target="_blank"
      aria-label={"Find me on Discord"}
      title={"Find me on Discord"}
      icon={<Icon as={RiDiscordFill} w={6} h={6} />}
      size="md"
      href="https://discordapp.com/users/krzysu#6531"
    /> */}
    <IconButton
      as={"a"}
      target="_blank"
      aria-label={"Follow NFT Tools"}
      title={"Follow NFT Tools"}
      icon={<Icon as={RiTwitterFill} w={6} h={6} />}
      size="md"
      href="https://twitter.com/nft_tools"
    />
  </>
);
