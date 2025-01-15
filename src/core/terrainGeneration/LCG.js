// Linear Congruential Generator; simple pseudo-random number generator
export class LCG {
    constructor(seed) {
        // using the same seed will always produce the same output
        this.m = 2 ** 32;         // Modulus (determines the range of numbers that can be generated) 
        this.a = 1664525;         // Multiplier
        this.c = 1;      // Increment
        if (seed == undefined) {
            this.state = Math.floor(Math.random() * this.m);        // Initial seed
        } else {
            this.state = seed;
        }
    }

    // Generate the next pseudo-random number
    next() {
        this.state = (this.a * this.state + this.c) % this.m;
        return (this.state / this.m - 0.5); // Normalize to range [0, 1]
    }
}
