import { ethers } from "hardhat";

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const MarketContract = await ethers.getContractFactory("Marketplace");
    const result = await MarketContract.deploy("0x2D8C160588D21154f689a357dD180109F3363F36", 5);
    await result.deployed();
    console.log("Deployed address:", result.address);
  } catch (error) {
    console.log("Fail to deploy contract");
    console.log(error);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
