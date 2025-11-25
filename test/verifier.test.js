const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Verifier and ZKPApplication', () => {
  let verifier;
  let app;
  let App;
  const proof = {
    a: [1n, 2n],
    b: [
      [3n, 4n],
      [5n, 6n]
    ],
    c: [7n, 8n]
  };
  const publicSignals = [1n, 2n, 3n];

  beforeEach(async () => {
    const Verifier = await ethers.getContractFactory('Verifier');
    verifier = await Verifier.deploy();
    await verifier.waitForDeployment();

    App = await ethers.getContractFactory('ZKPApplication');
    app = await App.deploy(await verifier.getAddress());
    await app.waitForDeployment();
  });

    it('emits event when proof is accepted', async () => {
      await expect(app.submitProof(proof.a, proof.b, proof.c, publicSignals, 'integration'))
        .to.emit(app, 'ProofAccepted')
        .withArgs(
          await app.runner.address,
          'integration',
          ethers.solidityPackedKeccak256(['uint256[]'], [publicSignals])
        );
    });

  it('reverts when proof input is empty', async () => {
    await expect(app.submitProof(proof.a, proof.b, proof.c, [], 'fail')).to.be.reverted;
  });

  it('reverts when public signal exceeds scalar field', async () => {
    const tooLarge =
      21888242871839275222246405745257275088548364400416034343698204186575808495617n;
    await expect(app.submitProof(proof.a, proof.b, proof.c, [tooLarge], 'fail')).to.be.revertedWithCustomError(
      verifier,
      'PublicInputOutOfRange'
    );
  });

  it('reverts when proof coordinates exceed scalar field', async () => {
    const fieldLimit = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
    const invalidProof = {
      a: [fieldLimit, 2n],
      b: proof.b,
      c: proof.c
    };

    await expect(app.submitProof(invalidProof.a, invalidProof.b, invalidProof.c, publicSignals, 'overflow')).to.be.revertedWithCustomError(
      verifier,
      'ProofPointOutOfRange'
    );
  });

  it('rejects deployments with a zero-address verifier', async () => {
    await expect(App.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(App, 'ZeroAddress');
  });
});
