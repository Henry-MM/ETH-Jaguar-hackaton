import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { arbitrum, base, mainnet, optimism, polygon, sepolia, arbitrumSepolia } from "viem/chains";

export const config = getDefaultConfig({
  appName: "Prestamigo",
  projectId: import.meta.env.VITE_REOWN_ID_PROJECT ?? "",
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRIUM_CONNECT ?? "" ),
  },
  connectors:{
    walletConnect: {
      chains: [arbitrumSepolia],
    },
  }
});

