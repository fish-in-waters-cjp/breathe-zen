"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Meditate.module.css";

// Define a mapping of breathing timings for different configurations
const breathingTimingsMap = {
  ethereum: { inhale: 4, hold: 4, exhale: 4 },
  polygon: { inhale: 2, hold: 2, exhale: 2 },
  custom: { inhale: 4, hold: 2, exhale: 7 },
};

// Choose the configuration you want (e.g. "custom")
const selectedTimings = breathingTimingsMap.custom;

export default function Meditate() {
  // Initial 3-2-1 countdown state (before starting the breathing cycle)
  const [initialCount, setInitialCount] = useState(3);
  // Breathing phase: null means not started; then "inhale", "hold", "exhale", or "done"
  const [breathingPhase, setBreathingPhase] = useState("");
  // Seconds remaining in the current breathing phase
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  // Circle scale state: 1 = minimum, 1.5 = maximum (you can adjust these values)
  const [circleScale, setCircleScale] = useState(1);
  // Transition duration (in seconds) for the circle scaling animation
  const [transitionDuration, setTransitionDuration] = useState(0);

  const router = useRouter();

  // INITIAL COUNTDOWN EFFECT
  useEffect(() => {
    if (initialCount > 0) {
      const timer = setTimeout(() => {
        setInitialCount(initialCount - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // When initial countdown finishes, start the breathing cycle in the "inhale" phase.
      setBreathingPhase("inhale");
      setPhaseTimeLeft(selectedTimings.inhale);
      // Set circle transition: from scale 1 (min) to 1.5 (max) over the inhale duration
      setTransitionDuration(selectedTimings.inhale);
      setCircleScale(1); // ensure it starts at minimum scale
      // Slight delay allows the transition to register
      setTimeout(() => {
        setCircleScale(1.5);
      }, 50);
    }
  }, [initialCount]);

  // BREATHING PHASE EFFECT (handles inhale, hold, exhale)
  useEffect(() => {
    if (breathingPhase && phaseTimeLeft > 0) {
      const timer = setTimeout(() => {
        setPhaseTimeLeft(phaseTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (breathingPhase && phaseTimeLeft === 0) {
      // Transition to the next phase when the current phase ends
      if (breathingPhase === "inhale") {
        // Move to "hold" phase
        setBreathingPhase("hold");
        setPhaseTimeLeft(selectedTimings.hold);
        // Keep the circle at maximum scale
        setCircleScale(1.5);
        setTransitionDuration(0);
      } else if (breathingPhase === "hold") {
        // Move to "exhale" phase
        setBreathingPhase("exhale");
        setPhaseTimeLeft(selectedTimings.exhale);
        // Set transition: from max (1.5) to min (1) over exhale duration
        setTransitionDuration(selectedTimings.exhale);
        setTimeout(() => {
          setCircleScale(1);
        }, 50);
      } else if (breathingPhase === "exhale") {
        // When exhale is finished, the breathing cycle is done – navigate to result page.
        setBreathingPhase("done");
        router.push("/result");
      }
    }
  }, [breathingPhase, phaseTimeLeft, router]);

  return (
    <div className={styles.container}>
      {/* Initial countdown display */}
      {initialCount > 0 && (
        <div className={styles.overlayCountdown}>{initialCount}</div>
      )}

      {/* Breathing cycle display */}
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
          {/* During exhale, if there are 3 seconds or less left, show an overlay countdown */}
          {breathingPhase === "exhale" && phaseTimeLeft <= 3 && (
            <div className={styles.overlayCountdown}>{phaseTimeLeft}</div>
          )}
        </div>
      )}
    </div>
  );
}
