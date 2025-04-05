"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until mounted to avoid mismatches
  if (!mounted) return null;

  const meditationRecord = {
    id: 10,
    totalCount: 10,
    chain: "mainnet",
    startBlock: 1849234,
    endBlock: 1849258,
    startTime: "2023-08-01 09:00:00",
    endTime: "2023-08-01 09:10:00",
  };

  if (!isConnected) {
    return (
      <div className={styles.loginContainer}>
        <p className={styles.headerTitle}>Please log in first</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.connectButton}>
        <ConnectButton />
      </div>

      <div className={styles.mainContainer}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>✨ Breath Reflection ✨</h1>
        </header>

        {/* Meditation Record */}
        <section className={styles.recordSection}>
          <h2 className={styles.recordTitle}>Last Session</h2>
          {meditationRecord ? (
            <div className={styles.recordCard}>
              <div>
                <p className={styles.recordText}>
                  ⏳ Duration:{" "}
                  <span className={styles.spanWhite}>10 minutes</span>
                </p>
                <p className={styles.recordText}>
                  🔗 Chain:{" "}
                  <span className={styles.spanWhite}>
                    {meditationRecord.chain}
                  </span>
                </p>
                <p className={styles.recordText}>
                  🌌 Inhale — Block{" "}
                  <span className={styles.spanWhite}>
                    {meditationRecord.startBlock}
                  </span>
                </p>
                <p className={`${styles.recordText} ${styles.italic}`}>
                  Inhaled in harmony with the universe.
                </p>
                <p
                  className={`${styles.recordText} ${styles.recordTextSmallMargin}`}
                >
                  🌬️ Exhale — Block{" "}
                  <span className={styles.spanWhite}>
                    {meditationRecord.endBlock}
                  </span>
                </p>
                <p className={`${styles.recordText} ${styles.italic}`}>
                  Exhaled all distractions away.
                </p>
              </div>
            </div>
          ) : (
            <p className={styles.recordText}>No record available</p>
          )}
        </section>

        {/* CTA Button */}
        <div className={styles.ctaContainer}>
          <Link href="/meditate" className={styles.ctaButtonLarge}>
            Start New Session
          </Link>
          <Link
            href="/settings"
            title="Settings"
            className={styles.ctaButtonSmall}
          >
            ⚙️ Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
