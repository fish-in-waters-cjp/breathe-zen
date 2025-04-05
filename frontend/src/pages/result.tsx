"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/Result.module.css";
import { getBreathMessage } from "../hooks/getBreathMessage";
import { useBreath } from "../contexts/BreathContext";
import { chainSettings, formatDuration } from "./settings";
import { useBlockNumber } from "wagmi";

export default function Result() {
  const [message, setMessage] = useState<{
    part1: React.ReactElement;
    part2: React.ReactElement;
  } | null>(null);

  const { chain, startBlock } = useBreath();
  const router = useRouter();

  const { data: endBlock } = useBlockNumber() ?? { data: 0 };
  console.log("endBlock", endBlock);

  const chainName = chain
    ? chain.charAt(0)?.toUpperCase() + chain.slice(1)
    : "Ethereum";
  const totalDuration = chainSettings[chain ?? "ethereum"]?.totalDuration;
  const duration = formatDuration(totalDuration);

  useEffect(() => {
    if (!endBlock || !chainName || !duration || !startBlock) return;
    const selected = getBreathMessage(
      chainName,
      duration,
      startBlock,
      endBlock
    );
    setMessage(selected);
  }, [endBlock, chainName, duration, startBlock]);

  if (!message) {
    return <p className="text-gray-500">Preparing your message...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Session Complete</h1>
      </header>
      {endBlock ? (
        <>
          <p className={styles.text}>{message.part1}</p>
          <p className={styles.text}>{message.part2}</p>
        </>
      ) : (
        <p className={styles.text}>Fetching Ethereum block data...</p>
      )}
      <button
        className={styles.ctaButtonLarge}
        onClick={() => router.push("/")}
      >
        Go Back
      </button>
    </div>
  );
}
