#!/usr/bin/env node
/**
 * Build Hardhat-compatible artifacts using solc-js without requiring a remote compiler download.
 * This script is intended for offline/CI environments where fetching compilers is blocked.
 */
const fs = require('fs');
const path = require('path');
const solc = require('solc');

const CONTRACTS_DIR = path.resolve(__dirname, '..', 'contracts');
const ARTIFACTS_ROOT = path.resolve(__dirname, '..', 'artifacts');

/**
 * Recursively load Solidity source files under the contracts directory.
 * @param {string} dir absolute directory path
 * @returns {Record<string, {content: string}>}
 */
function loadSources(dir) {
  const sources = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const resolvedPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(sources, loadSources(resolvedPath));
      continue;
    }

    if (!entry.name.endsWith('.sol')) continue;
    const relPath = path.relative(path.resolve(__dirname, '..'), resolvedPath).replace(/\\/g, '/');
    const content = fs.readFileSync(resolvedPath, 'utf8');
    sources[relPath] = { content };
  }

  return sources;
}

/**
 * Custom import resolver for solc to load local files (including interfaces).
 */
function findImports(importPath) {
  const resolved = path.resolve(CONTRACTS_DIR, importPath);
  if (fs.existsSync(resolved)) {
    return { contents: fs.readFileSync(resolved, 'utf8') };
  }
  return { error: `File not found: ${importPath}` };
}

/**
 * Persist an artifact in Hardhat's expected format.
 */
function writeArtifact(sourceName, contractName, compiled) {
  if (!compiled.evm?.bytecode?.object) {
    // Skip interfaces or abstract contracts lacking bytecode.
    return;
  }

  const artifactPath = path.join(ARTIFACTS_ROOT, sourceName, `${contractName}.json`);
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });

  const artifact = {
    _format: 'hh-sol-artifact-1',
    contractName,
    sourceName,
    abi: compiled.abi,
    bytecode: `0x${compiled.evm.bytecode.object}`,
    deployedBytecode: `0x${compiled.evm.deployedBytecode.object}`,
    linkReferences: compiled.evm.bytecode.linkReferences ?? {},
    deployedLinkReferences: compiled.evm.deployedBytecode.linkReferences ?? {}
  };

  fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(`[artifacts] wrote ${artifactPath}`);
}

function main() {
  const sources = loadSources(CONTRACTS_DIR);
  if (Object.keys(sources).length === 0) {
    console.error('[!] No Solidity sources found.');
    process.exit(1);
  }

  const input = {
    language: 'Solidity',
    sources,
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  if (output.errors) {
    const hasError = output.errors.some((err) => err.severity === 'error');
    output.errors.forEach((err) => console.error(`[solc] ${err.severity}: ${err.formattedMessage}`));
    if (hasError) {
      process.exit(1);
    }
  }

  for (const [sourceName, contracts] of Object.entries(output.contracts)) {
    for (const [contractName, compiled] of Object.entries(contracts)) {
      writeArtifact(sourceName, contractName, compiled);
    }
  }

  console.log('[artifacts] build complete');
}

main();
