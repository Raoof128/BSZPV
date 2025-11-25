# API & ABI Reference

## Contracts

### Verifier (stub)

- **verifyProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[] publicSignals) → bool**
  - Performs validation on proof coordinates and public signals (non-empty, within scalar field) and emits `ProofVerified`.
  - Replace implementation with `snarkjs`-generated verifier for production deployments.

### ZKPApplication

- **constructor(address verifierAddress)** – Stores the verifier contract address.
- **submitProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[] publicSignals, string context)**
  - Delegates verification to `verifierAddress` and emits `ProofAccepted` with a hash of public signals.
- **transferOwnership(address newOwner)** – Update contract owner (cannot be zero address).

## Events

- **ProofVerified(address sender, bytes32 publicInputsHash)** – Emitted by `Verifier` after validation.
- **ProofAccepted(address sender, string context, bytes32 publicSignalsHash)** – Emitted by `ZKPApplication` on successful verification.
- **OwnershipTransferred(address previousOwner, address newOwner)** – Ownership change notification.
- **ZeroAddress** – Revert when deploying with an invalid verifier address or transferring ownership to the zero address.

## Proof Encoding

When using `snarkjs`, convert generated proof JSON into calldata-friendly arrays:

```bash
node -e "const fs=require('fs');const proof=require('./proof.json');console.log({a:proof.proof.pi_a.slice(0,2),b:[[proof.proof.pi_b[0][0],proof.proof.pi_b[0][1]],[proof.proof.pi_b[1][0],proof.proof.pi_b[1][1]]],c:proof.proof.pi_c.slice(0,2),publicSignals:proof.publicSignals});"
```

Use the resulting arrays to call `submitProof` from clients or integration tests.
