import React from "react";

export const getBreathMessage = (
  chainName: string,
  duration: string,
  startBlock: bigint,
  endBlock: bigint
) => {
  const style = {
    color: "rgb(234,244,203)",
  };
  const messages = [
    {
      part1: (
        <>
          You just synced your breath with the{" "}
          <span style={style}>{chainName}</span> for{" "}
          <span style={style}>{duration}</span> — from block{" "}
          <span style={style}>{startBlock}</span> to{" "}
          <span style={style}>{endBlock}</span>, each pulse aligned with the
          rhythm of the universe.
        </>
      ),
      part2: (
        <>
          Your presence has now been etched into the chain — forever breathing
          among the stars.
        </>
      ),
    },
    {
      part1: (
        <>
          For <span style={style}>{duration}</span>, you breathed in harmony
          with the <span style={style}>{chainName}</span>.
        </>
      ),
      part2: (
        <>
          From block <span style={style}>{startBlock}</span> to{" "}
          <span style={style}>{endBlock}</span>, your rhythm became one with the
          chain. This moment of stillness is now immortal — written into the
          timeless fabric of the chain.
        </>
      ),
    },
    {
      part1: (
        <>
          You entered flow with the <span style={style}>{chainName}</span>,
          synchronizing each breath from block{" "}
          <span style={style}>{startBlock}</span> to{" "}
          <span style={style}>{endBlock}</span>.
        </>
      ),
      part2: (
        <>
          A trace of your calm now lives on-chain — encoded in permanence, as
          breath becomes memory.
        </>
      ),
    },
    {
      part1: (
        <>
          You’ve just shared <span style={style}>{duration}</span> of presence
          with the <span style={style}>{chainName}</span> — blocks{" "}
          <span style={style}>{startBlock}</span> to{" "}
          <span style={style}>{endBlock}</span>.
        </>
      ),
      part2: (
        <>
          This breath is now eternal — recorded as part of your quiet legacy,
          on-chain.
        </>
      ),
    },
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
