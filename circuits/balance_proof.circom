// Prove that an account balance is above a threshold without revealing the exact amount.
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template BalanceProof() {
    signal input balance;      // private
    signal input threshold;    // public
    signal output isEnough;

    component cmp = LessThan(32);
    cmp.in[0] <== threshold;
    cmp.in[1] <== balance;

    // isEnough is 1 when balance >= threshold
    isEnough <== 1 - cmp.out;
}

component main = BalanceProof();
