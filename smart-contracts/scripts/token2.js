const { ethers } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const MPToken2 = await ethers.getContractFactory('MPToken2');
  const token2 = await MPToken2.deploy(deployer.address);

  await token2.waitForDeployment();

  const token2Address = await token2.getAddress();

  console.log('MoneyPlant Token 2 deployed to:', token2Address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
