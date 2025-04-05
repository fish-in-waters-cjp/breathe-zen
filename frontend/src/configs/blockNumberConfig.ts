import { http, createConfig } from "@wagmi/core";
import { mainnet, polygon, optimism, arbitrum, base } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});
