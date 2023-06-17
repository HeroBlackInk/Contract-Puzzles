const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const [owner, nonOwner] = await ethers.getSigners(); // Getting both owner and nonOwner from the signers list

    console.log('Owner address: ', owner.address);
    console.log('Non-Owner address: ', nonOwner.address); // Logging the nonOwner address


    return { game,owner,nonOwner };
  }
  it('should be a winner', async function () {
    const { game,owner,nonOwner } = await loadFixture(deployContractAndSetVariables);

      await game.connect(nonOwner).write(owner.address);
      await game.connect(owner).win(nonOwner.address);

    
 

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
