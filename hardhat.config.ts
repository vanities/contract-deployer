import * as ethers from "ethers";
import * as fs from "fs";
import glob from "glob";
import path from "path";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-abi-exporter";

/**
 * this loads all the tasks from the tasks folder
 */
if (process.env.BUILDING !== "true") {
  glob.sync("./tasks/**/*.ts").forEach((file: string) => {
    require(path.resolve(file));
  });
}

const defaultNetwork = "mainnet";
const mainnetGwei = 33;
const accounts = [
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f",
];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 250,
      },
    },
  },
  defaultNetwork,
  networks: {
    hardhat: {
      blockGasLimit: 100000000,
    },
    development: { url: "http://localhost:8545" },
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts,
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad",
      gasPrice: mainnetGwei * 1000000000,
      accounts,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: accounts,
    },
    matic: {
      url: "https://polygon-rpc.com",
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      goerli: "4E7CEGX4I8Y51V2DUYCRFNP3T2BRXZGKNK",
      mainnet: "GE7Z7C7BPICA39HPQ1ZRJVQB7MUEIK3HB3",
      polygon: "6Y8JX9HQ3ZZNHWBTNR63HYTED23DF3WGN5",
      polygonMumbai: "6Y8JX9HQ3ZZNHWBTNR63HYTED23DF3WGN5",
    },
  },
};

export default config;
