"use client";
// pages/settings.js
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Settings() {
  const router = useRouter();
  const [chain, setChain] = useState("mainnet");
  //   const [duration, setDuration] = useState(5) // 以分鐘為單位

  const goBack = () => router.push("/");

  const handleSave = () => {
    // 儲存設定 (此處可擴充為 context 或後端 API)
    // localStorage.setItem('settings', JSON.stringify({ chain, duration }))
    goBack();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>設定頁</h1>
      <div style={{ margin: "10px 0" }}>
        <label>
          選擇鏈（頻率）:
          <select value={chain} onChange={(e) => setChain(e.target.value)}>
            <option value="mainnet">Mainnet</option>
            <option value="polygon">Polygon</option>
          </select>
        </label>
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>
          時間 (分鐘):
          {/* <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /> */}
        </label>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} style={{ marginRight: "10px" }}>
          儲存
        </button>
        <button onClick={goBack}>取消</button>
      </div>
    </div>
  );
}
