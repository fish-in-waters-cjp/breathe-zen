import React, { createContext, useContext, useState } from "react";

type BreathState = {
  chain: string | null;
  startBlock: bigint | null;
  setChain: (chain: string) => void;
  setStartBlock: (block: bigint) => void;
  reset: () => void;
};

const BreathContext = createContext<BreathState | undefined>(undefined);

export const BreathProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chain, setChainName] = useState<string | null>(null);
  const [startBlock, setStartBlock] = useState<bigint | null>(null);

  const setChain = (name: string) => {
    setChainName(name);
  };

  const reset = () => {
    setChainName(null);
    setStartBlock(null);
  };

  return (
    <BreathContext.Provider
      value={{
        chain,
        startBlock,
        setChain,
        setStartBlock,
        reset,
      }}
    >
      {children}
    </BreathContext.Provider>
  );
};

export const useBreath = () => {
  const context = useContext(BreathContext);
  if (!context) {
    throw new Error("useBreath must be used within a BreathProvider");
  }
  return context;
};
