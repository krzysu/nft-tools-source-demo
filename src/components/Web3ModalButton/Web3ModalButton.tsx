import React, { useEffect } from "react";
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { useWeb3Modal } from "./useWeb3Modal";

export const Web3ModalButton = () => {
  const { account, activate, deactivate } = useEthers();
  const { provider, activateProvider, deactivateProvider } = useWeb3Modal();
  const { ens } = useLookupAddress(account);

  useEffect(() => {
    if (provider) {
      activate(provider);
    } else {
      deactivate();
    }
  }, [provider]);

  return (
    <>
      {!account && <Button onClick={activateProvider}>Connect wallet</Button>}

      {account && (
        <Flex minH="40px" alignItems="center">
          <Box>
            <Text as="span" fontWeight="bold">
              {ens ?? shortenAddress(account)}
            </Text>
            {" | "}
            <Link onClick={deactivateProvider} textDecoration="underline">
              Disconnect
            </Link>
          </Box>
        </Flex>
      )}
    </>
  );
};
