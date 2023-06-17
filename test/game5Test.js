const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');
const { expect } = require("chai");


const targetThreshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

async function findPrivateKey() {
  while (true) {
    const randomWallet = ethers.Wallet.createRandom();
    const addressBytes = ethers.utils.arrayify(randomWallet.address);

    if (ethers.utils.hexlify(addressBytes) < targetThreshold) {
      console.log(`Found a private key that meets the condition!`);
      console.log(`Private Key: ${randomWallet.privateKey}`);
      console.log(`Address: ${randomWallet.address}`);
      return([randomWallet.privateKey,randomWallet.address]);
    }
  }
}




describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const [owner] = await ethers.getSigners();
    
    return { game,owner };
  }
  it('should be a winner', async function () {
    const { game,owner } = await loadFixture(deployContractAndSetVariables);


    let [privateKey,address] = await findPrivateKey()
    console.log(privateKey)
    console.log(address)
    
    // Send 1 Ether from owner to the address
    const amountToSend = ethers.utils.parseEther("1");
    await owner.sendTransaction({
      to: address,
      value: amountToSend,
    });

    const wallet = new ethers.Wallet(privateKey, ethers.provider);
    await game.connect(wallet).win();   

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
