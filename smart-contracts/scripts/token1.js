
const { ethers } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy the MoneyPlantNFT contract
  const MPToken1 = await ethers.getContractFactory('MPToken1');
  const token1 = await MPToken1.deploy(deployer.address);

  await token1.waitForDeployment();

  const token1Address = await token1.getAddress();

  console.log('MoneyPlant Token 1 deployed to:', token1Address);

    await hre.run("verify:verify", {
    address: token1Address,
    constructorArguments: [deployer.address],
    contract: "contracts/MPToken1.sol:MPToken1"

  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
