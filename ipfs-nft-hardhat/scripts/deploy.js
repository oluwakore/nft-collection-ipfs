// const hre = require("hardhat");
const {ethers} = require("hardhat");
require("dotenv").config({ path: ".env"})



async function main() {
  
  const metadataURL = "ipfs://QmQGFpRFvmSU5oDg4Xn71JqE3xLz5i6fdKFD3JqdXzvCpP/"


  const mavPunksContract = await ethers.getContractFactory("MAVPunks")

  const deployedMavPunksContract = await mavPunksContract.deploy(metadataURL)

  await deployedMavPunksContract.deployed();

  console.log("MavPunks Contact Address:", deployedMavPunksContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
