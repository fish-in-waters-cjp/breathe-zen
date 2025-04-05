"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useChains, useConfig, usePublicClient, useWriteContract } from "wagmi";
import MeditationRecorderABI from "../abis/MeditationRecorder.json";
import { CONTRACTS } from "../config/contracts";
import { useBreath } from "../contexts/BreathContext";
import { getBreathMessage } from "../hooks/getBreathMessage";
import styles from "../styles/Result.module.css";
import { chainSettings, formatDuration } from "./settings";

export const chainIds: { [key: string]: number } = {
  ethereum: 1,
  polygon: 137,
  optimism: 10,
  arbitrum: 42161,
  base: 8453,
} as const;

export default function Result() {
  const [message, setMessage] = useState<{
    part1: React.ReactElement;
    part2: React.ReactElement;
  } | null>(null);

  const { chain, startBlock } = useBreath();
  const [blockNumber, setBlockNumber] = useState(1);
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const [isRecording, setIsRecording] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [endBlock, setEndBlock] = useState<bigint | null>(null);

  const chainName = chain
    ? chain.charAt(0)?.toUpperCase() + chain.slice(1)
    : "Ethereum";
  const totalDuration = chainSettings[chain ?? "ethereum"]?.totalDuration;
  const duration = formatDuration(totalDuration);

  const { writeContractAsync: recordMeditation } = useWriteContract();
  const chains = useChains();
  const config = useConfig();
  const currentChain = config.chains.find(c => c.id === chainId);
  const publicClient = usePublicClient();

  useEffect(() => {
    const selected = getBreathMessage(
      chainName,
      duration,
      startBlock ? startBlock : BigInt(0),
      endBlock ?? BigInt(0)
    );
    setMessage(selected);
  }, [chainName, duration, endBlock, startBlock]);

  useEffect(() => {
    if (!chainName || !duration || !startBlock) return;
    const getMsgAndBlockHeight = async () => {
      const chainId = chainIds[chain ?? "ethereum"] as
        | 1
        | 10
        | 137
        | 42161
        | 8453;
      try {
        const blockNumber = await publicClient.getBlockNumber();
        setEndBlock(blockNumber);
        const selected = getBreathMessage(
          chainName,
          duration,
          startBlock,
          blockNumber
        );
        setMessage(selected);
      } catch (error) {
        console.error('Error getting block number:', error);
      }
    };
    getMsgAndBlockHeight();
  }, [chainName, duration, startBlock, publicClient]);

  useEffect(() => {
    const recordMeditationSession = async () => {
      if (isRecording || recordSuccess || !address || !startBlock || !endBlock || !totalDuration) {
        return;
      }

      const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.MeditationRecorder;
      if (!contractAddress) {
        setErrorMessage(`Contract not found for chain ID: ${chainId}`);
        return;
      }
      
      setIsRecording(true);
      try {
        const hash = await recordMeditation({
          address: contractAddress as `0x${string}`,
          abi: MeditationRecorderABI.abi,
          functionName: 'recordMeditation',
          args: [
            BigInt(startBlock),
            BigInt(endBlock),
            BigInt(totalDuration),
            chain ?? "ethereum"
          ],
          chainId: chainId,
          account: address,
          chain: currentChain
        });
        
        setRecordSuccess(true);
      } catch (error: any) {
        if (error.message?.includes('queue')) {
          setErrorMessage('請稍後再試，目前請求過多');
        } else {
          setErrorMessage(error?.message || '交易失敗，請查看控制台獲取詳細信息');
        }
        setIsRecording(false);
      }
    };

    if (address && startBlock && endBlock && totalDuration && !isRecording && !recordSuccess) {
      recordMeditationSession();
    }
  }, [address, chainId, endBlock, startBlock, chain, totalDuration, isRecording, recordSuccess]);

  if (!message) {
    return <p className="text-gray-500">Preparing your message...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Session Complete</h1>
      </header>

      {!address && <p>Please connect your wallet first</p>}

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</p>
      )}

      {isRecording && !recordSuccess && (
        <p>Recording your meditation time on the blockchain...</p>
      )}

      {recordSuccess && (
        <p style={{ color: "green" }}>Meditation record saved successfully!</p>
      )}

      {blockNumber && (
        <>
          <p className={styles.text}>{message.part1}</p>
          <p className={styles.text}>{message.part2}</p>
        </>
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
