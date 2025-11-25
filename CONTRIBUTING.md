# Contributing Guidelines

Thank you for your interest in contributing! We welcome improvements to circuits, smart contracts, documentation, scripts, and tests.

## Process
1. Fork the repository and create a feature branch.
2. Run `npm install` to set up dependencies.
3. Write clear, well-commented code with tests.
4. Run `npm run lint` and `npm test` before submitting.
5. Open a pull request with a concise summary and reference to any related issues.

## Development Standards
- Prefer TypeScript/JavaScript that conforms to ESLint + Prettier rules (see configuration files).
- Solidity code should target `pragma solidity ^0.8.20;`, avoid inline assembly unless justified, and include NatSpec comments.
- Circom circuits should include signal constraints comments and expected public inputs.
- Never commit secrets or private keys. Use environment variables and `.env` (excluded via `.gitignore`).

## Communication
- For security vulnerabilities, follow the process in [SECURITY.md](SECURITY.md).
- For feature requests or questions, open a GitHub issue with clear reproduction steps or use cases.
