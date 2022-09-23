import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  injected: {
    package: null,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

const web3Modal =
  typeof window !== "undefined"
    ? new Web3Modal({
        providerOptions,
        cacheProvider: true,
      })
    : undefined;

export default web3Modal;
