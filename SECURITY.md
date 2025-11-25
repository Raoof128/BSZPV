# Security Policy

## Supported Versions

The project is maintained on the `main` branch. Security fixes are backported on a best-effort basis.

## Reporting a Vulnerability

- Email: security@zkp-verifier.example (replace with your security contact)
- Include a clear description, reproduction steps, impact, and potential fixes.
- Please allow at least 7 business days for acknowledgment.

## Handling Secrets

- Never commit private keys, seeds, or proving/verification keys. Use environment variables and off-chain storage.
- Review `.gitignore` before committing to ensure sensitive assets (e.g., `.zkey`, `.ptau`, `.wasm`) remain excluded.

## Verification Guidance

- Run `npm run lint`, `npm test`, and security linters (e.g., `slither` if available) before deployment.
- For smart contracts, use testnets (Sepolia/Mumbai) and independent audits before mainnet deployment.
- For circuits, validate with constraint debugging and cross-check public signals against the application specification.
