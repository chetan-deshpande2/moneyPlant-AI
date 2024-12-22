

// scripts/deploy.js
const { ethers } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy the MoneyPlantNFT contract
  const MoneyPlantNFT = await ethers.getContractFactory('MoneyPlantNFT');
  const moneyPlantNFT = await MoneyPlantNFT.deploy(
    deployer.address,
    deployer.address,
    deployer.address
  );

  await moneyPlantNFT.waitForDeployment();

  const nftAddress = await moneyPlantNFT.getAddress()

  console.log('MoneyPlantNFT deployed to:', await moneyPlantNFT.getAddress());

  // Granting roles (if needed)
  console.log('Granting roles...');
  await moneyPlantNFT.grantRole(
    await moneyPlantNFT.PAUSER_ROLE(),
    deployer.address
  );
  await moneyPlantNFT.grantRole(
    await moneyPlantNFT.MINTER_ROLE(),
    deployer.address
  );
  console.log('Roles granted successfully.');

//   await hre.run("verify:verify", {
//     address: nftAddress,
//     constructorArguments: [deployer.address,deployer.address,deployer.address],
//   });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
