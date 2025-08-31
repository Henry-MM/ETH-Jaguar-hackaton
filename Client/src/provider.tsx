import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { colors } from "@heroui/theme";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHref, useNavigate } from "react-router-dom";
import { createConfig, http, WagmiProvider } from "wagmi";
// import { config } from "./config/rainbowKit";
import { arbitrumSepolia } from "viem/chains";
import { metaMask, walletConnect } from "@wagmi/connectors";

declare module "@react-types/shared" {
   interface RouterConfig {
      routerOptions: NavigateOptions;
   }
}

const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
   metaMask(),
   walletConnect({projectId: import.meta.env.VITE_REOWN_ID_PROJECT ?? "" })
  ],
  transports: {
    [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRIUM_CONNECT ?? "" ),
  }
});

const queryClient = new QueryClient();

export function Provider({ children }: { children: React.ReactNode }) {
   const navigate = useNavigate();

   return (
      <HeroUIProvider navigate={navigate} useHref={useHref}>
         <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
               <RainbowKitProvider theme={lightTheme({ accentColor: colors.green[500] })}>
                  {children}
               </RainbowKitProvider>
            </QueryClientProvider>
         </WagmiProvider>
      </HeroUIProvider>
   );
}
