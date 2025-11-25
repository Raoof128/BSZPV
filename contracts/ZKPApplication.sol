// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IGroth16Verifier} from "./interfaces/IGroth16Verifier.sol";

/// @title ZKPApplication
/// @notice Example wrapper delegating Groth16 verification and emitting audit-friendly events.
/// @dev Pair this wrapper with the circuit-specific verifier generated via `snarkjs` or the stub Verifier.sol for local tests.
contract ZKPApplication {
    IGroth16Verifier public immutable verifier;
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ProofAccepted(address indexed sender, string context, bytes32 publicSignalsHash);

    error NotOwner();
    error VerificationFailed();
    error ZeroAddress();

    constructor(address verifierAddress) {
        if (verifierAddress == address(0)) revert ZeroAddress();
        verifier = IGroth16Verifier(verifierAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Submit a Groth16 proof for verification.
    /// @param a Proof element A (G1 point encoded as 2 uint256 values).
    /// @param b Proof element B (G2 point encoded as 2x2 uint256 values).
    /// @param c Proof element C (G1 point encoded as 2 uint256 values).
    /// @param publicSignals Flattened public inputs for the circuit.
    /// @param context Human-readable label for analytics (e.g., "age", "balance", "merkle").
    function submitProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[] calldata publicSignals,
        string calldata context
    ) external {
        bool valid = verifier.verifyProof(a, b, c, publicSignals);
        if (!valid) revert VerificationFailed();

        bytes32 signalsHash = keccak256(abi.encodePacked(publicSignals));
        emit ProofAccepted(msg.sender, context, signalsHash);
    }
}
