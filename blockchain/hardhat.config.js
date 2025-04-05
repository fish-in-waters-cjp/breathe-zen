require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); 


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    amoy: {
      url: process.env.AMOY_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 80002
    }
  },
};
