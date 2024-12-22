const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MoneyPlant1 Contract', function () {
  let MoneyPlant1, moneyPlant1, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const MoneyPlant1Factory = await ethers.getContractFactory('MoneyPlant1');
    moneyPlant1 = await MoneyPlant1Factory.deploy(owner.address);
  });

  it('Should have correct initial supply', async function () {
    const initialSupply = await moneyPlant1.totalSupply();
    const decimals = await moneyPlant1.decimals();
    expect(initialSupply).to.equal(ethers.parseUnits('1000', decimals));
  });

  it('Should set the correct owner', async function () {
    expect(await moneyPlant1.owner()).to.equal(owner.address);
  });

  it('Should allow the owner to mint tokens', async function () {
    await moneyPlant1.mint(addr1.address, ethers.parseUnits('100', 18));
    const balance = await moneyPlant1.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseUnits('100', 18));
  });

  it('Should not allow non-owner to mint tokens', async function () {
    const amount = ethers.utils.parseUnits('100', 18); // Correct usage of parseUnits
    await expect(
      moneyPlant1.connect(addr1).mint(addr2.address, amount)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Should allow the owner to pause and unpause the contract', async function () {
    await moneyPlant1.pause();
    expect(await moneyPlant1.paused()).to.be.true;

    await moneyPlant1.unpause();
    expect(await moneyPlant1.paused()).to.be.false;
  });

  it('Should prevent transfers while paused', async function () {
    await moneyPlant1.pause();

    await expect(
      moneyPlant1.transfer(addr1.address, ethers.parseUnits('10', 18))
    ).to.be.revertedWith('Pausable: paused');
  });

  it('Should allow transfers after unpausing', async function () {
    await moneyPlant1.pause();
    await moneyPlant1.unpause();

    await moneyPlant1.transfer(addr1.address, ethers.parseUnits('10', 18));
    const balance = await moneyPlant1.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseUnits('10', 18));
  });
});
