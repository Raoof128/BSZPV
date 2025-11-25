const { ethers, network } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${deployer.address} to ${network.name}`);

  const verifierFactory = await ethers.getContractFactory('Verifier');
  const verifier = await verifierFactory.deploy();
  await verifier.waitForDeployment();
  console.log('Verifier deployed at', await verifier.getAddress());

  const appFactory = await ethers.getContractFactory('ZKPApplication');
  const app = await appFactory.deploy(await verifier.getAddress());
  await app.waitForDeployment();
  console.log('ZKPApplication deployed at', await app.getAddress());
}

main().catch((error) => {
  console.error('Deployment failed:', error);
  process.exitCode = 1;
});
