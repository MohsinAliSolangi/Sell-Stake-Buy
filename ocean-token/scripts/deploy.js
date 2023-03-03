const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  const BrnToken = await hre.ethers.getContractFactory("BrnToken");
  const brntoken = await BrnToken.deploy();
  await brntoken.deployed();
  console.log("MrSToken deployed: ", brntoken.address);
  
  
  
  saveFrontendFiles(brntoken , "BrnToken");
}
function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname+"/";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// DappStakingBurning.surge.sh
