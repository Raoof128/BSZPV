#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const snarkjs = require('snarkjs');

/**
 * Validate that a file exists before use.
 * @param {string} filePath absolute or relative path
 */
function assertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`[!] Missing required file: ${filePath}`);
    process.exit(1);
  }
}

/**
 * Validate the structure of a snarkjs proof to catch malformed inputs early.
 * @param {object} proof snarkjs proof object
 */
function assertProofShape(proof) {
  if (!proof || !proof.pi_a || !proof.pi_b || !proof.pi_c) {
    console.error('[!] Proof is missing required fields (pi_a, pi_b, pi_c).');
    process.exit(1);
  }

  if (!Array.isArray(proof.pi_a) || proof.pi_a.length < 2) {
    console.error('[!] Proof.pi_a must contain at least 2 values.');
    process.exit(1);
  }

  if (
    !Array.isArray(proof.pi_b) ||
    proof.pi_b.length < 2 ||
    proof.pi_b.some((row) => !Array.isArray(row) || row.length < 2)
  ) {
    console.error('[!] Proof.pi_b must be a 2x2 array.');
    process.exit(1);
  }

  if (!Array.isArray(proof.pi_c) || proof.pi_c.length < 2) {
    console.error('[!] Proof.pi_c must contain at least 2 values.');
    process.exit(1);
  }
}

/**
 * Flatten snarkjs proof output into calldata-friendly arrays.
 * @param {object} proof snarkjs proof object
 * @param {string[]} publicSignals public inputs
 * @returns {{a: string[], b: string[][], c: string[], publicSignals: string[]}}
 */
function formatForCalldata(proof, publicSignals) {
  assertProofShape(proof);
  return {
    a: proof.pi_a.slice(0, 2),
    b: [
      [proof.pi_b[0][0], proof.pi_b[0][1]],
      [proof.pi_b[1][0], proof.pi_b[1][1]]
    ],
    c: proof.pi_c.slice(0, 2),
    publicSignals
  };
}

async function main() {
  const [inputPath, wasmPath, zkeyPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !wasmPath || !zkeyPath) {
    console.error(
      'Usage: node scripts/generate_proof.js <input.json> <circuit.wasm> <circuit.zkey> [output.json]'
    );
    process.exit(1);
  }

  assertFile(inputPath);
  assertFile(wasmPath);
  assertFile(zkeyPath);

  let witnessInput;
  try {
    witnessInput = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
  } catch (error) {
    console.error('[!] Invalid JSON input provided:', error.message);
    process.exit(1);
  }

  console.info('[+] Generating proof');
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    witnessInput,
    wasmPath,
    zkeyPath
  );

  const formatted = formatForCalldata(proof, publicSignals);

  console.info('[+] Proof generated');
  console.info(JSON.stringify({ proof, publicSignals, calldata: formatted }, null, 2));

  if (outputPath) {
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ proof, publicSignals, calldata: formatted }, null, 2)
    );
    console.info(`[+] Saved proof bundle to ${outputPath}`);
  }
}

main().catch((err) => {
  console.error('Proof generation failed:', err);
  process.exit(1);
});
