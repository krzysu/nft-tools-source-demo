import React, { FC } from "react";
import { useColorMode, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const ColorModeButton: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label={colorMode === "light" ? "Dark mode" : "Light mode"}
      title={colorMode === "light" ? "Dark mode" : "Light mode"}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      size="md"
      onClick={toggleColorMode}
    />
  );
};
