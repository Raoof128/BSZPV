require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const { SEPOLIA_RPC_URL, MUMBAI_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    mumbai: {
      url: MUMBAI_RPC_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || ''
    }
  }
};
