import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { BreathProvider } from "../contexts/BreathContext";
import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { hardhat, polygon } from 'wagmi/chains';

// import { config } from "../wagmi";

import {
  RainbowKitProvider,
  getDefaultConfig
} from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
  appName: "Breathe Zen",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    {
      ...polygon,
      rpcUrls: {
        default: { http: ["https://polygon-rpc.com"] }
      }
    },
    {
      ...hardhat,
      id: 1337,
      BreathZenToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      MeditationRecorder: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    }
  ],
  transports: {
    [polygon.id]: http(),
    [1337]: http('http://127.0.0.1:8545'),
  },
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BreathProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BreathProvider>
  );
}

export default MyApp;
