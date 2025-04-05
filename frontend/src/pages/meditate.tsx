"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Meditate.module.css";
import { useBreath } from "../contexts/BreathContext";

// Define a mapping of breathing timings for different configurations.
// Each object now includes a "cycles" property.
// Example: polygon will run 6 cycles (each cycle: 2 + 1 + 2 = 5 sec, total 30 sec).
const breathingTimingsMap = {
  ethereum: { inhale: 4, hold: 4, exhale: 4, cycles: 1 }, // 12s × 1 = 12s
  polygon: { inhale: 2, hold: 1, exhale: 2, cycles: 6 }, // 5s × 6 = 30s
  optimism: { inhale: 4, hold: 2, exhale: 6, cycles: 5 }, // 12s × 5 = 60s
  arbitrum: { inhale: 6, hold: 2, exhale: 7, cycles: 12 }, // 15s × 12 = 180s
  base: { inhale: 5, hold: 2, exhale: 8, cycles: 20 }, // 15s × 20 = 300s
};

export default function Meditate() {
  // Initial 3-2-1 countdown state (before starting the breathing cycle)
  const [initialCount, setInitialCount] = useState(3);
  // Breathing phase: "", "inhale", "hold", "exhale", or "done"
  const [breathingPhase, setBreathingPhase] = useState("");
  // Seconds remaining in the current phase
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  // Circle scale state: 1 = minimum, 1.5 = maximum
  const [circleScale, setCircleScale] = useState(1);
  // Transition duration (in seconds) for the circle scaling animation
  const [transitionDuration, setTransitionDuration] = useState(0);
  // Count the number of complete cycles finished
  const [cycleCount, setCycleCount] = useState(0);

  // Get the selected chain from the Breath context
  const { chain } = useBreath();
  // Use a fallback (e.g. "ethereum") if chain is undefined or not in the map.
  const selectedTimings =
    breathingTimingsMap[
      (chain as keyof typeof breathingTimingsMap) || "ethereum"
    ];

  const router = useRouter();

  // INITIAL COUNTDOWN EFFECT
  useEffect(() => {
    if (initialCount > 0) {
      const timer = setTimeout(() => {
        setInitialCount(initialCount - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Start the breathing cycle with the "inhale" phase
      setBreathingPhase("inhale");
      setPhaseTimeLeft(selectedTimings.inhale);
      setTransitionDuration(selectedTimings.inhale);
      setCircleScale(1); // start at minimum scale
      setTimeout(() => {
        setCircleScale(1.5);
      }, 50);
    }
  }, [initialCount, selectedTimings]);

  // BREATHING PHASE EFFECT
  useEffect(() => {
    if (breathingPhase && phaseTimeLeft > 0) {
      const timer = setTimeout(() => {
        setPhaseTimeLeft(phaseTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (breathingPhase && phaseTimeLeft === 0) {
      if (breathingPhase === "inhale") {
        // Transition from inhale to hold
        setBreathingPhase("hold");
        setPhaseTimeLeft(selectedTimings.hold);
        setCircleScale(1.5);
        setTransitionDuration(0);
      } else if (breathingPhase === "hold") {
        // Transition from hold to exhale
        setBreathingPhase("exhale");
        setPhaseTimeLeft(selectedTimings.exhale);
        setTransitionDuration(selectedTimings.exhale);
        setTimeout(() => {
          setCircleScale(1);
        }, 50);
      } else if (breathingPhase === "exhale") {
        // Completed one full cycle
        setCycleCount((prevCycleCount) => {
          const newCycleCount = prevCycleCount + 1;
          if (newCycleCount < selectedTimings.cycles) {
            // Start a new cycle
            setBreathingPhase("inhale");
            setPhaseTimeLeft(selectedTimings.inhale);
            setTransitionDuration(selectedTimings.inhale);
            setCircleScale(1);
            setTimeout(() => {
              setCircleScale(1.5);
            }, 50);
          } else {
            // All cycles complete – navigate to the result page
            setBreathingPhase("done");
            router.push("/result");
          }
          return newCycleCount;
        });
      }
    }
  }, [breathingPhase, phaseTimeLeft, router, selectedTimings]);

  return (
    <div className={styles.container}>
      {/* Display the initial countdown overlay */}
      {initialCount > 0 && (
        <div className={styles.overlayCountdown}>{initialCount}</div>
      )}

      {/* Display the breathing cycle UI when countdown is finished */}
      {breathingPhase && breathingPhase !== "done" && initialCount === 0 && (
        <div className={styles.breathingContainer}>
          <h1 className={styles.breathingText}>
            {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)}
          </h1>
          <div
            className={styles.circle}
            style={{
              transform: `scale(${circleScale})`,
              transition: `transform ${transitionDuration}s linear`,
            }}
          ></div>
          {/* During exhale, if 3 seconds or less remain, show the countdown overlay */}
          {breathingPhase === "exhale" && phaseTimeLeft <= 3 && (
            <div className={styles.overlayCountdown}>{phaseTimeLeft}</div>
          )}
        </div>
      )}
    </div>
  );
}
