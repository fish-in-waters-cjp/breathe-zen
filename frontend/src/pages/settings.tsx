"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../styles/Settings.module.css";

// Hard-coded settings for each chain.
// Each chain has a blockTime (seconds per block) and a fixed totalDuration (in seconds).
interface ChainSettings {
  label: string;
  blockTime: number;
  totalDuration: number;
}

const chainSettings: { [key: string]: ChainSettings } = {
  mainnet: {
    label: "Mainnet",
    blockTime: 15, // e.g., 15 sec per block
    totalDuration: 60, // 1 minute
  },
  polygon: {
    label: "Polygon",
    blockTime: 2, // 2 sec per block
    totalDuration: 10, // 10 sec
  },
  optimism: {
    label: "Optimism",
    blockTime: 2, // 2 sec per block
    totalDuration: 30, // 30 sec
  },
  arbitrum: {
    label: "Arbitrum",
    blockTime: 2, // 2 sec per block
    totalDuration: 180, // 3 minutes
  },
  base: {
    label: "Base",
    blockTime: 3, // 3 sec per block
    totalDuration: 300, // 5 minutes
  },
};

// Helper to format seconds into a human‑readable string.
const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  return remSec === 0 ? `${minutes} min` : `${minutes} min ${remSec} sec`;
};

export default function Settings() {
  const router = useRouter();
  const [chain, setChain] = useState("mainnet");
  const currentSettings = chainSettings[chain];
  const { blockTime, totalDuration } = currentSettings;
  // Calculate approximate block count
  const blocksCount = Math.floor(totalDuration / blockTime);

  const goBack = () => router.push("/");
  const handleSave = () => {
    // Save settings here (e.g., in context or localStorage)
    // localStorage.setItem('settings', JSON.stringify({ chain, settings: currentSettings }));
    goBack();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Settings</h1>
      </header>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Select Chain:
          <select
            className={styles.select}
            value={chain}
            onChange={(e) => setChain(e.target.value)}
          >
            {Object.keys(chainSettings).map((key) => (
              <option key={key} value={key}>
                {chainSettings[key].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.recordSection}>
        <h2 className={styles.recordTitle}>Breathing Session Details</h2>
        <div className={styles.recordCard}>
          <div>
            <p className={styles.recordText}>
              ⏱️ Block Time:{" "}
              <span className={styles.spanWhite}>
                {blockTime} sec per block
              </span>
            </p>
            <p className={styles.recordText}>
              ⏳ Total Duration:{" "}
              <span className={styles.spanWhite}>
                {formatDuration(totalDuration)}
              </span>
            </p>
            <p className={styles.recordText}>
              🧘‍♀️ Blocks Breathed with{" "}
              <span className={styles.spanWhite}>
                ~{blocksCount} {blocksCount !== 1 ? "blocks" : "block"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.ctaContainer}>
        <button className={styles.ctaButtonLarge} onClick={handleSave}>
          Save Settings
        </button>
        <button className={styles.ctaButtonSmall} onClick={goBack}>
          Cancel
        </button>
      </div>
    </div>
  );
}
