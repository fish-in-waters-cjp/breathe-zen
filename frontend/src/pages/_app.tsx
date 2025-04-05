import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

// import { config } from "../wagmi";

import {
  RainbowKitProvider,
  getDefaultConfig,
  Chain,
} from "@rainbow-me/rainbowkit";

const breathChain = {
  id: 137, // Polygon 主網 Chain ID
  name: "Polygon BREATH",
  network: "polygon",
  iconUrl: "YOUR_BREATH_TOKEN_ICON_URL", // 你的 BREATH 代幣圖示 URL
  iconBackground: "#fff",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: { name: "Polygonscan", url: "https://polygonscan.com" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11", // 示例地址，請根據實際情況修改
      blockCreated: 0, // 若有需要，可填入代幣部署時的區塊號
    },
  },
} as const;

const config = getDefaultConfig({
  appName: "Breathe Zen",
  projectId: "YOUR_PROJECT_ID",
  chains: [breathChain],
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
