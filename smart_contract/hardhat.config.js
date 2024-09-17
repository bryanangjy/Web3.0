require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    polygonzkevm: {
      url: 'https://polygonzkevm-cardona.g.alchemy.com/v2/Yc7IP8a_JBNItO1C-Sfsj5Q6OQcxDQJ2', // Replace with your Alchemy testnet API key
      accounts: [ '86f6d48bcb16e2a8ee80c34a75d9541c627527a429f31b1a9ddce7c5cfc5bc42' ],  // Replace with your actual private key
      chainId: 2442  // Polygon zkEVM chain ID
    }
  }
}
