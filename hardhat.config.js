require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    baseGoerli: {
      url: 'https://mainnet.base.org',
      accounts: ['0xc3f2bd44d9832ae5829805343fe2e775f7b8f15a47e0047efe161b8fe726d116'],
      gasPrice: 1000000000,  // 1 gwei
      gas: 2,
      timeout: 60000
    },
  },
};
