const {ethers} = require("hardhat")

async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");
  const deployedWhitelistContract = whitelistContract.deploy(10);
  await deployedWhitelistContract.deployed();
  console.log("Whitelist Contract Address", deployedWhitelistContract.address);
}