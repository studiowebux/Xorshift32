import { assertEquals } from "@std/assert";
import {
  generate_float,
  generate_integer,
  generate_min_max_integer,
  initialize_prng,
  load_prng_state,
  save_prng_state,
} from "../src/mod.ts";

Deno.test("Test PRNG Implementation", () => {
  const prng = initialize_prng(123456);
  assertEquals(prng.state, 123456);

  const integer = generate_integer(prng);
  assertEquals(integer, 3044438244);

  const min_max_interger = generate_min_max_integer(prng, 1, 3); // min is inclusive and max is exclusive
  assertEquals(min_max_interger, 2);

  const float = generate_float(prng);
  assertEquals(float, 0.2612984177010592);

  const saved_state = save_prng_state(prng);
  assertEquals(saved_state, 561134079);

  const integer2 = generate_integer(prng);
  assertEquals(integer2, 2951787001);
  assertEquals(prng.state, 2951787001);

  load_prng_state(prng, saved_state);
  assertEquals(prng.state, 561134079);
});
