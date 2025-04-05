type ContractAddresses = {
  [chainId: number]: {
    BreathZenToken: string;
    MeditationRecorder: string;
  };
};

export const CONTRACTS: ContractAddresses = {
  137: { // Polygon
    BreathZenToken: "YOUR_POLYGON_TOKEN_ADDRESS",
    MeditationRecorder: "YOUR_POLYGON_RECORDER_ADDRESS"
  },
  1337: { // Localhost/Hardhat
    BreathZenToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    MeditationRecorder: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  }
}; 