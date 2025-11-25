# Setup Guide

## Prerequisites

- Node.js 20+ and npm 10+
- Circom v2.1.8+ (install from https://docs.circom.io/getting-started/installation/). The helper script checks for the binary before running.
- `snarkjs` v0.7.0+ (`npm install -g snarkjs`) and on PATH.
- `bash`, `git`, and optional Docker for reproducible builds

## Environment Variables

Copy `.env.example` to `.env` and provide:

- `SEPOLIA_RPC_URL` / `MUMBAI_RPC_URL`
- `PRIVATE_KEY` for deployments (use a funded testnet account)
- `ETHERSCAN_API_KEY` / `POLYGONSCAN_API_KEY` for verifier verification

# Trusted Setup (Groth16)

```bash
# 1) Powers of Tau
snarkjs powersoftau new bn128 14 pot14_0000.ptau
snarkjs powersoftau contribute pot14_0000.ptau pot14_final.ptau

# 2) Circuit-specific keys
circom circuits/age_verification.circom --r1cs --wasm --sym -o artifacts/age_verification
snarkjs groth16 setup artifacts/age_verification/age_verification.r1cs pot14_final.ptau artifacts/age_verification/age_verification.zkey
snarkjs zkey export verificationkey artifacts/age_verification/age_verification.zkey artifacts/age_verification/verification_key.json

# 3) Solidity verifier (replace Verifier.sol in production)
snarkjs zkey export solidityverifier artifacts/age_verification/age_verification.zkey contracts/generated/AgeVerifier.sol
```

> Keep the generated verifier under `contracts/generated/` to separate audited code from auto-generated artifacts.

## Proof Generation

```bash
node scripts/generate_proof.js examples/age_input.json artifacts/age_verification/age_verification_js/age_verification.wasm artifacts/age_verification/age_verification.zkey
```

The output contains `proof` and `publicSignals`. Convert them into arrays (`a`, `b`, `c`, `publicSignals`) before on-chain submission (see `docs/API.md`).

## Deployment

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Testing

- Build offline Hardhat artifacts (skip compiler download): `npm run build:artifacts`
- Circuit tests: `npm run test:circuit`
- Contract tests (re-uses offline artifacts): `npm run test:contracts`
- Full suite: `npm test`
