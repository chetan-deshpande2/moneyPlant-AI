const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MoneyPlantNFT Contract', function () {
  let MoneyPlantNFT, moneyPlantNFT;
  let defaultAdmin, pauser, minter, addr1, addr2;

  beforeEach(async function () {
    // Get signers
    [defaultAdmin, pauser, minter, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const MoneyPlantNFTFactory = await ethers.getContractFactory(
      'MoneyPlantNFT'
    );
    moneyPlantNFT = await MoneyPlantNFTFactory.deploy(
      defaultAdmin.address,
      pauser.address,
      minter.address
    );
  });

  it('Should set the correct roles during deployment', async function () {
    expect(
      await moneyPlantNFT.hasRole(
        await moneyPlantNFT.DEFAULT_ADMIN_ROLE(),
        defaultAdmin.address
      )
    ).to.be.true;
    expect(
      await moneyPlantNFT.hasRole(
        await moneyPlantNFT.PAUSER_ROLE(),
        pauser.address
      )
    ).to.be.true;
    expect(
      await moneyPlantNFT.hasRole(
        await moneyPlantNFT.MINTER_ROLE(),
        minter.address
      )
    ).to.be.true;
  });

  it('Should allow pauser to pause and unpause the contract', async function () {
    // Pause
    await moneyPlantNFT.connect(pauser).pause();
    expect(await moneyPlantNFT.paused()).to.be.true;

    // Unpause
    await moneyPlantNFT.connect(pauser).unpause();
    expect(await moneyPlantNFT.paused()).to.be.false;
  });

  it('Should not allow non-pauser to pause or unpause', async function () {
    await expect(moneyPlantNFT.connect(addr1).pause()).to.be.revertedWith(
      `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await moneyPlantNFT.PAUSER_ROLE()}`
    );

    await expect(moneyPlantNFT.connect(addr1).unpause()).to.be.revertedWith(
      `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await moneyPlantNFT.PAUSER_ROLE()}`
    );
  });
  it('Should allow minter to mint NFTs', async function () {
    await moneyPlantNFT.connect(minter).safeMint(addr1.address);
    expect(await moneyPlantNFT.balanceOf(addr1.address)).to.equal(1);
    expect(await moneyPlantNFT.ownerOf(0)).to.equal(addr1.address);
  });

  it('Should increment token IDs during minting', async function () {
    await moneyPlantNFT.connect(minter).safeMint(addr1.address);
    await moneyPlantNFT.connect(minter).safeMint(addr2.address);

    expect(await moneyPlantNFT.ownerOf(0)).to.equal(addr1.address);
    expect(await moneyPlantNFT.ownerOf(1)).to.equal(addr2.address);
  });

  it('Should not allow non-minters to mint NFTs', async function () {
    await expect(
      moneyPlantNFT.connect(addr1).safeMint(addr1.address)
    ).to.be.revertedWith(
      `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await moneyPlantNFT.MINTER_ROLE()}`
    );
  });

  it('Should prevent transfers while paused', async function () {
    await moneyPlantNFT.connect(minter).safeMint(addr1.address);

    // Pause the contract
    await moneyPlantNFT.connect(pauser).pause();

    // Attempt to transfer the token
    await expect(
      moneyPlantNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
    ).to.be.revertedWith('Pausable: paused');
  });

  it('Should allow transfers after unpausing', async function () {
    await moneyPlantNFT.connect(minter).safeMint(addr1.address);

    // Pause and unpause the contract
    await moneyPlantNFT.connect(pauser).pause();
    await moneyPlantNFT.connect(pauser).unpause();

    // Transfer the token
    await moneyPlantNFT
      .connect(addr1)
      .transferFrom(addr1.address, addr2.address, 0);
    expect(await moneyPlantNFT.ownerOf(0)).to.equal(addr2.address);
  });
  it('Should allow admin to grant and revoke roles', async function () {
    // Grant PAUSER_ROLE to addr1
    await moneyPlantNFT
      .connect(defaultAdmin)
      .grantRole(await moneyPlantNFT.PAUSER_ROLE(), addr1.address);
    expect(
      await moneyPlantNFT.hasRole(
        await moneyPlantNFT.PAUSER_ROLE(),
        addr1.address
      )
    ).to.be.true;

    // Revoke PAUSER_ROLE from addr1
    await moneyPlantNFT
      .connect(defaultAdmin)
      .revokeRole(await moneyPlantNFT.PAUSER_ROLE(), addr1.address);
    expect(
      await moneyPlantNFT.hasRole(
        await moneyPlantNFT.PAUSER_ROLE(),
        addr1.address
      )
    ).to.be.false;
  });
});
