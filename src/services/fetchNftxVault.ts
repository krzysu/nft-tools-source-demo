import config from "../collections/config";

type VaultData = {
  holdings: {
    tokenId: string;
  }[];
  fees: {
    mintFee: string;
    targetRedeemFee: string;
  };
  usesFactoryFees: boolean;
  lpStakingPool: {
    stakingToken: {
      id: string;
    };
  };
};

type Response = {
  data: {
    globals: [
      {
        fees: {
          mintFee: string;
          targetRedeemFee: string;
        };
      }
    ];
    vault: VaultData;
  };
};

export const fetchNftxVault = async (
  address: string
): Promise<VaultData | undefined> => {
  const vaultAddress = config[address].nftxVaultAddress;
  if (!vaultAddress) {
    return;
  }

  const url = `https://api.thegraph.com/subgraphs/name/nftx-project/nftx-v2`;
  const query = `
  {
    globals {
      fees {
        mintFee
        targetRedeemFee
      }
    }
    vault(id: "${vaultAddress}") {
      fees {
        mintFee
        targetRedeemFee
      }
      usesFactoryFees
      asset {
        id
        name
      }
      holdings(first: 1000) {
        tokenId
      }
      lpStakingPool {
        stakingToken {
          id
        }
      }
    }
  }
   `;

  try {
    const tracking = `PERF: fetchNftxVault`;
    console.time(tracking);

    const responseRaw = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
      },
      body: JSON.stringify({ query }),
    });

    const response = (await responseRaw.json()) as Response;
    if (!response.data) {
      return;
    }

    const vault = response.data.vault;
    const globalFees = response.data.globals[0].fees;

    console.timeEnd(tracking);
    return {
      ...vault,
      ...(vault.usesFactoryFees ? { fees: globalFees } : {}),
    };
  } catch (e) {
    console.error(e);
    return;
  }
};
