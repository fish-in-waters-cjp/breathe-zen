"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import MeditationRecorderABI from "../abis/MeditationRecorder.json";
import { CONTRACTS } from "../config/contracts";
import { useBreath } from "../contexts/BreathContext";
import { getBreathMessage } from "../hooks/getBreathMessage";
import styles from "../styles/Result.module.css";
import { chainSettings, formatDuration } from "./settings";

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

  const chainName = chain
    ? chain.charAt(0)?.toUpperCase() + chain.slice(1)
    : "Ethereum";
  const totalDuration = chainSettings[chain ?? "ethereum"]?.totalDuration;
  const duration = formatDuration(totalDuration);
  const endBlock = 1849258;

  // 從 localStorage 獲取開始時間，確保是有效的數字
  const rawStartTime = localStorage.getItem('meditationStartTime');
  const startTime = rawStartTime ? parseInt(rawStartTime) : null;
  const endTime = Math.floor(Date.now() / 1000); // 當前時間作為結束時間

  const { writeContractAsync: recordMeditation } = useWriteContract();

  useEffect(() => {
    const selected = getBreathMessage(
      chainName,
      duration,
      startBlock ? startBlock : BigInt(0),
      BigInt(endBlock)
    );
    setMessage(selected);
  }, [chainName, duration, endBlock, startBlock]);

  useEffect(() => {
    const recordMeditationSession = async () => {
      console.log('=== Initial Check ===');
      console.log('isRecording:', isRecording);
      console.log('recordSuccess:', recordSuccess);
      console.log('startTime:', startTime);
      console.log('address:', address);
      console.log('chainId:', chainId);

      if (!address) {
        console.log('No wallet connected');
        return;
      }

      if (!startTime) {
        console.log('No start time found');
        return;
      }

      if (isRecording || recordSuccess) {
        console.log('Already recording or success');
        return;
      }

      if (!isRecording && !recordSuccess && startTime && !isNaN(startTime) && address) {
        const startTimeNum = Math.floor(Number(startTime));
        const endTimeNum = Math.floor(Number(endTime));
        
        // 驗證時間範圍
        if (endTimeNum <= startTimeNum) {
          setErrorMessage('Invalid time range: end time must be greater than start time');
          return;
        }

        const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.MeditationRecorder;
        if (!contractAddress) {
          setErrorMessage(`Contract not found for chain ID: ${chainId}`);
          return;
        }

        console.log('=== Meditation Record Details ===');
        console.log('Chain ID:', chainId);
        console.log('Contract Address:', contractAddress);
        console.log('User Address:', address);
        console.log('Start Time:', new Date(startTimeNum * 1000).toLocaleString());
        console.log('End Time:', new Date(endTimeNum * 1000).toLocaleString());
        console.log('Duration (minutes):', (endTimeNum - startTimeNum) / 60);
        
        setIsRecording(true);
        try {
          const hash = await recordMeditation({
            address: contractAddress as `0x${string}`,
            abi: MeditationRecorderABI.abi,
            functionName: 'recordMeditation',
            args: [BigInt(startTimeNum), BigInt(endTimeNum)]
          });
          
          console.log('Transaction hash:', hash);
          setRecordSuccess(true);
          localStorage.removeItem('meditationStartTime');
        } catch (error: any) {
          console.error('Transaction error:', error);
          setErrorMessage(error?.message || 'Transaction failed. Please check console for details.');
          setIsRecording(false);
        }
      }
    };

    recordMeditationSession();
  }, [address, chainId, endTime, isRecording, recordMeditation, recordSuccess, startTime]);

  if (!message) {
    return <p className="text-gray-500">Preparing your message...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Session Complete</h1>
      </header>

      {!address && (
        <p>Please connect your wallet first</p>
      )}
      
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
