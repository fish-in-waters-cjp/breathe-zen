const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // 部署 BreathZenToken
  const BreathZenToken = await hre.ethers.getContractFactory("BreathZenToken");
  const breathZenToken = await BreathZenToken.deploy(deployer.address);
  await breathZenToken.waitForDeployment();
  console.log("BreathZenToken deployed to:", await breathZenToken.getAddress());

  // 部署 MeditationRecorder
  const MeditationRecorder = await hre.ethers.getContractFactory("MeditationRecorder");
  const meditationRecorder = await MeditationRecorder.deploy(await breathZenToken.getAddress());
  await meditationRecorder.waitForDeployment();
  console.log("MeditationRecorder deployed to:", await meditationRecorder.getAddress());

  // 將 MeditationRecorder 設為 BreathZenToken 的擁有者
  const tx = await breathZenToken.transferOwnership(await meditationRecorder.getAddress());
  await tx.wait();
  console.log("Ownership transferred to MeditationRecorder");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 