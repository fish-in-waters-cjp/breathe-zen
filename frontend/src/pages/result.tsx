"use client";

import { useRouter } from "next/navigation";
// import { useProvider } from "wagmi";
import { useEffect, useState } from "react";
import styles from "../styles/Result.module.css";
import { getBreathMessage } from "../hooks/getBreathMessage";

export default function Result() {
  const [message, setMessage] = useState<{
    part1: React.ReactElement;
    part2: React.ReactElement;
  } | null>(null);

  const [blockNumber, setBlockNumber] = useState(1);
  // const provider = useProvider();
  const router = useRouter();

  // useEffect(() => {
  //   async function fetchBlock() {
  //     const block = await provider.getBlockNumber();
  //     setBlockNumber(block);
  //   }
  //   fetchBlock();
  // }, [provider]);

  //TODO: Hard-coded session details; adjust these as needed.
  const chainName = "XX Chain";
  const duration = "10 minutes";
  const startBlock = 1849234;
  const endBlock = 1849258;

  useEffect(() => {
    const selected = getBreathMessage(
      chainName,
      duration,
      startBlock,
      endBlock
    );
    setMessage(selected);
  }, []);

  if (!message) {
    return <p className="text-gray-500">Preparing your message...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Session Complete</h1>
      </header>
      {blockNumber ? (
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
