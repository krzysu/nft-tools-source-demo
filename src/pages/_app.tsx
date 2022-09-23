import React, { FC } from "react";
import { ethers } from "ethers";
import Head from "next/head";
import { AppProps } from "next/app";
import { Mainnet, DAppProvider } from "@usedapp/core";
import { ChakraProvider, Container, Grid } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getMetaTags } from "../components/MetaTags";

const INTERVAL = 15 * 1000; // 15s
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
);
mainnetProvider.pollingInterval = INTERVAL;

const dAppConfig = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: mainnetProvider,
  },
  pollingInterval: INTERVAL,
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  },
};

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.svg" />
        {getMetaTags({
          title: "NFT Tools",
          description: "easily browse and compare NFTs",
          image: "https://nft-tools.xyz/logo_dark.png",
        })}
      </Head>

      <ChakraProvider>
        <DAppProvider config={dAppConfig}>
          <Container maxW="container.xl">
            <Grid minH="100vh" templateRows="auto 1fr auto">
              <Header />
              <Component {...pageProps} />
              <Footer buildDate={pageProps.buildDate} />
            </Grid>
          </Container>
        </DAppProvider>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
