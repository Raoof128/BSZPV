# Security & Compliance Guide

This repository targets production-grade deployments and follows privacy-by-design principles.

## Threat Model

- **Assets**: proving keys, verification keys, verifier contracts, user inputs, off-chain infrastructure.
- **Actors**: honest users, malicious provers, malicious verifiers, network adversaries.
- **Goals**: confidentiality of private inputs, soundness of proofs, availability of verification, integrity of verifier contracts.

## Controls

- **Key Management**: store proving keys offline; publish verification keys with hashes. Track checksums for WASM and `.zkey` artifacts.
- **Transport**: use HTTPS and authenticated RPC endpoints. Avoid leaking public signals beyond intended scope.
- **Smart Contracts**: prefer immutable verification keys; gate administrative actions; emit events for verification attempts; replace the stub verifier with a generated contract before production.
- **Reproducibility**: document Powers of Tau contributions; version circuits; tag releases with artifact hashes.

## Compliance Notes

- Aligns with ISO/TC 307 privacy guidance and Australian Privacy Act data-minimisation principles.
- Encourage data minimisation: public signals should be the smallest necessary disclosures.
- Document cross-border data transfer considerations if hosting proving services outside AU jurisdictions.

## Audit Checklist

- [ ] Circuits reviewed for constraint completeness and no unconstrained signals.
- [ ] Trusted setup transcripts archived and reproducible.
- [ ] Contracts fuzzed (e.g., `forge fuzz`) and linted (`solhint`/`slither`).
- [ ] Gas benchmarks recorded and regressions tracked.
- [ ] Dependencies scanned (`npm audit`, `npm outdated`).
- [ ] Generated verifier bytecode reviewed against verification key hashes.
