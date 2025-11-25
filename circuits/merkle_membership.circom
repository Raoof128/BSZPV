// Prove membership in a Merkle tree without revealing the leaf value.
pragma circom 2.0.0;

include "circomlib/circuits/merkleproof.circom";

template MerkleMembership(depth) {
    signal input leaf;                // private leaf
    signal input root;                // public Merkle root
    signal input pathElements[depth]; // public sibling nodes
    signal input pathIndices[depth];  // public path directions (0 = left, 1 = right)
    signal output isMember;

    // Restrict path indices to boolean values to avoid malformed proofs.
    for (var j = 0; j < depth; j++) {
        pathIndices[j] * (pathIndices[j] - 1) === 0;
    }

    component proof = MerkleTreeInclusionProof(depth);
    for (var i = 0; i < depth; i++) {
        proof.pathElements[i] <== pathElements[i];
        proof.pathIndex[i] <== pathIndices[i];
    }

    proof.leaf <== leaf;
    proof.root === root; // constrain calculated root to provided root

    isMember <== 1; // emits a boolean-like output for consistency
}

component main { public [root, pathElements, pathIndices] } = MerkleMembership(16);
