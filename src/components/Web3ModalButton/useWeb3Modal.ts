import { useCallback, useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import web3Modal from "./web3Modal";

function useWeb3ModalImpl() {
  const [provider, setProvider] = useState();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        setIsConnecting(true);
        const p = await web3Modal!.connect();
        setProvider(p);
      } catch (error: any) {
        console.error(error.message);
        setError(error.message);
      }
      setIsConnecting(false);
    };

    if (web3Modal && web3Modal.cachedProvider && !provider && !isConnecting) {
      run();
    }
  }, []);

  const activateProvider = useCallback(async () => {
    try {
      setError("");
      setIsConnecting(true);
      const provider = await web3Modal!.connect();
      setProvider(provider);
    } catch (error: any) {
      console.error(error.message);
      setError(error.message);
    }
    setIsConnecting(false);
  }, []);

  const deactivateProvider = useCallback(() => {
    web3Modal!.clearCachedProvider();
    setProvider(undefined);
  }, []);

  return {
    provider,
    activateProvider,
    deactivateProvider,
    isConnecting,
    providerError: error,
  };
}

const initValue = {
  provider: undefined,
  activateProvider: () => {},
  deactivateProvider: () => {},
  isConnecting: false,
  providerError: "",
};

export const useWeb3Modal = singletonHook(initValue, useWeb3ModalImpl);
