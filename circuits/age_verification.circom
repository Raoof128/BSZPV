// Prove that a prover is over a required minimum age without revealing the birth year.
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template AgeVerification() {
    // Private inputs
    signal input birthYear;
    // Public inputs
    signal input currentYear;
    signal input minAge;
    signal output isOldEnough;

    component cmp = LessThan(16);
    // Compare (currentYear - birthYear) < minAge ?
    signal age;
    age <== currentYear - birthYear;

    cmp.in[0] <== minAge;
    cmp.in[1] <== age;

    // isOldEnough is true when age >= minAge
    isOldEnough <== 1 - cmp.out;
}

component main = AgeVerification();
