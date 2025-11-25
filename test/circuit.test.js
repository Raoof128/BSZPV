const { expect } = require('chai');
const fs = require('fs');

const circuits = ['age_verification', 'balance_proof', 'merkle_membership'];

describe('Circuits presence', () => {
  circuits.forEach((name) => {
    it(`${name} circuit exists and documents public signals`, () => {
      const content = fs.readFileSync(`circuits/${name}.circom`, 'utf8');
      expect(content).to.contain('signal');
      expect(content).to.match(/component main/);
    });
  });
});
