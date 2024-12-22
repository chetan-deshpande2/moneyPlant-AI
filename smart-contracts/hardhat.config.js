require('@nomicfoundation/hardhat-toolbox');
// require('@nomiclabs/hardhat-etherscan');
require('hardhat-gas-reporter');
require('dotenv').config();
require('solidity-coverage');

const { PRIVATE_KEY, POLYGON_API_KEY, POLYGON_RPC_URL } = process.env;

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(process.env.POLYGON_RPC_URL);
  }
});

module.exports = {
  solidity: {
    version: '0.8.22',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    polygonTestnet: {
      url: POLYGON_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: POLYGON_API_KEY,
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21,
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: './contracts',
  },
  sourcify: {
    enabled: true,
  },

  plugins: ['solidity-coverage'],
};
