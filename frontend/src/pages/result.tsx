"use client";
// pages/result.js
// import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useProvider } from "wagmi";

export default function End() {
  //   const [blockNumber, setBlockNumber] = useState(null);
  const blockNumber = 123;
  //   const provider = useProvider();
  const router = useRouter();

  //   useEffect(() => {
  //     async function fetchBlock() {
  //       const block = await provider.getBlockNumber();
  //       setBlockNumber(block);
  //     }
  //     fetchBlock();
  //   }, [provider]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>結束頁</h1>
      {blockNumber ? (
        <p>你跟第 {blockNumber} 塊以太塊一起呼吸</p>
      ) : (
        <p>取得以太塊資料中...</p>
      )}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => router.push("/")}>返回</button>
      </div>
    </div>
  );
}
