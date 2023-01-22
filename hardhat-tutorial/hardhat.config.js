require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: ".env"});

const API_KEY_URL = process.env.API_KEY_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: API_KEY_URL,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};

