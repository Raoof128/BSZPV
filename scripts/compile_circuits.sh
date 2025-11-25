#!/usr/bin/env bash
set -euo pipefail

CIRCUITS=(
  age_verification
  balance_proof
  merkle_membership
)

OUTPUT_DIR="${OUTPUT_DIR:-artifacts}"
POT_FILE="${POT_FILE:-pot14_final.ptau}"

command -v circom >/dev/null 2>&1 || { echo "[!] circom is required but not installed." >&2; exit 1; }
command -v snarkjs >/dev/null 2>&1 || { echo "[!] snarkjs is required but not installed." >&2; exit 1; }

mkdir -p "$OUTPUT_DIR"

if [ ! -f "$POT_FILE" ]; then
  echo "[!] Missing $POT_FILE. Run snarkjs powersoftau before compiling." >&2
  exit 1
fi

for circuit in "${CIRCUITS[@]}"; do
  echo "[+] Compiling $circuit.circom"
  circom "circuits/${circuit}.circom" --r1cs --wasm --sym -o "$OUTPUT_DIR/$circuit"
  echo "[+] Groth16 setup for $circuit"
  snarkjs groth16 setup "$OUTPUT_DIR/$circuit/${circuit}.r1cs" "$POT_FILE" "$OUTPUT_DIR/$circuit/${circuit}.zkey"
  snarkjs zkey export verificationkey "$OUTPUT_DIR/$circuit/${circuit}.zkey" "$OUTPUT_DIR/$circuit/verification_key.json"
  echo "[+] Solidity verifier generation"
  snarkjs zkey export solidityverifier "$OUTPUT_DIR/$circuit/${circuit}.zkey" "contracts/${circuit}_verifier.sol"
  echo "[+] Done with $circuit"
done
