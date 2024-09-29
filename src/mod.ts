const FLOAT_DIVISOR = 0xffffffff;

/**
 * Represents a Xorshift32 pseudo-random number generator.
 */
export class Xorshift32 {
  state: number;
  /**
   * Creates an instance of Xorshift32.
   * @param {number} [seed=1] The seed value for the generator.
   */
  constructor(seed: number = 1) {
    /**
     * The current state of the generator.
     * @type {number}
     */
    this.state = seed >>> 0;
  }

  /**
   * Generates the next pseudo-random integer.
   * @private
   * @returns {number} The next pseudo-random integer.
   */
  _nextInt(): number {
    if (this.state === 0) {
      throw new Error(
        "State cannot be zero. Use a valid seed or restore a saved state.",
      );
    }

    let x = this.state;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;

    this.state = x >>> 0;
    return this.state; // Ensure non-negative integer
  }

  /**
   * Generates the next pseudo-random integer.
   * @returns {number} The next pseudo-random integer.
   */
  next(): number {
    return this._nextInt();
  }

  /**
   * Generates the next pseudo-random integer within the specified range.
   * @param {number} min The minimum value (inclusive) of the range.
   * @param {number} max The maximum value (exclusive) of the range.
   * @returns {number} A pseudo-random integer within the specified range.
   */
  nextInRange(min: number, max: number): number {
    if (max <= min) {
      throw new RangeError("Max must be greater than min in nextInRange");
    }

    const value = this.next() % (max - min);
    return value + min;
  }

  /**
   * Generates the next pseudo-random floating-point number in the range [0, 1).
   * @returns {number} The next pseudo-random floating-point number.
   */
  nextFloat(): number {
    const value = this.next();
    return value / FLOAT_DIVISOR;
  }

  /**
   * Returns the current state of the generator.
   * @returns {number} The current state of the generator.
   */
  saveState(): number {
    return this.state;
  }

  /**
   * Restores the generator's state to the specified value.
   * @param {number} savedState The state value to restore.
   * @returns {Xorshift32} return itself
   */
  restoreState(savedState: number): Xorshift32 {
    this.state = savedState;
    return this;
  }
}

/**
 * Create a prng instance with a seed
 * @param {number} seed The seed value for the generator.
 * @returns {Xorshift32}
 */
export function initialize_prng(seed: number): Xorshift32 {
  return new Xorshift32(seed);
}

/**
 * Save prng state
 * @param {Xorshift32} prng The generator instance.
 * @returns {number}
 */
export function save_prng_state(prng: Xorshift32): number {
  return prng.saveState();
}

/**
 * Load prng state
 * @param {Xorshift32} prng The generator instance.
 * @param {number} state The saved value for the generator.
 * @returns {Xorshift32}
 */
export function load_prng_state(prng: Xorshift32, state: number): Xorshift32 {
  return prng.restoreState(state);
}

/**
 * Generate random integer
 * @param {Xorshift32} prng The generator instance.
 * @returns {number} A random integer number.
 */
export function generate_integer(prng: Xorshift32): number {
  return prng.next();
}

/**
 * Generate random min/max integer
 * @param {Xorshift32} prng The generator instance.
 * @param {number} min The minimum value (inclusive) of the range.
 * @param {number} max The maximum value (exclusive) of the range.
 * @returns {number} A random integer number.
 */
export function generate_min_max_integer(
  prng: Xorshift32,
  min: number,
  max: number,
): number {
  if (max <= min) {
    throw new RangeError(
      "Max must be greater than min in generate_min_max_integer",
    );
  }
  const value = prng.nextInRange(min, max);
  return value;
}

/**
 * Generate random float integer
 * @param {Xorshift32} prng The generator instance.
 * @returns {number} A random float number.
 */
export function generate_float(prng: Xorshift32): number {
  return prng.nextFloat();
}
