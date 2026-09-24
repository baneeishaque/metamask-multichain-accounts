/**
 * SLIP-0010 hierarchical deterministic derivation for ed25519.
 *
 * BIP-32 derives child keys with the group operation of secp256k1 — an
 * elliptic-curve point addition that ed25519's twisted Edwards form cannot
 * reproduce. SLIP-0010 solves this for ed25519 by dropping the public-key
 * branch of the derivation entirely: a child key is HMAC-SHA512 of the parent
 * chain code and the parent *private* key, so only hardened steps exist.
 *
 * That single restriction is why Solana accounts live at hardened-only paths
 * such as `m/44'/501'/0'/0'`, and why the same seed produces an ed25519 tree
 * that is cryptographically independent of the secp256k1 tree beside it.
 *
 * Reference: SLIP-0010 "Universal private key derivation from master private
 * key" (SatoshiLabs). The test suite pins the official specification vectors.
 */

import { hmac } from "@noble/hashes/hmac.js";
import { sha512 } from "@noble/hashes/sha2.js";
import { concatBytes, utf8ToBytes } from "@noble/hashes/utils.js";

/** A derived ed25519 node: the 32-byte key seed plus its chain code. */
export interface Slip10Node {
  readonly privateKey: Uint8Array;
  readonly chainCode: Uint8Array;
}

/** Index at which BIP-32/SLIP-0010 hardened derivation starts. */
const HARDENED_OFFSET = 0x80000000;

/** HMAC key of the SLIP-0010 ed25519 master generation, per the spec. */
const CURVE_SEED = utf8ToBytes("ed25519 seed");

/** Serialize a 32-bit index as four big-endian bytes. */
function ser32(index: number): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, index, false);
  return bytes;
}

/**
 * Derive the SLIP-0010 master node for ed25519 from a BIP-39 seed.
 *
 * @param seed - 64-byte BIP-39 seed (with or without a passphrase).
 * @returns Master private key and chain code.
 */
export function masterNode(seed: Uint8Array): Slip10Node {
  const digest = hmac(sha512, CURVE_SEED, seed);
  return { privateKey: digest.slice(0, 32), chainCode: digest.slice(32) };
}

/**
 * Derive one hardened child node.
 *
 * @param parent - Parent node.
 * @param index - Child index, already offset into the hardened range.
 * @returns Child private key and chain code.
 */
function childNode(parent: Slip10Node, index: number): Slip10Node {
  const data = concatBytes(new Uint8Array([0]), parent.privateKey, ser32(index));
  const digest = hmac(sha512, parent.chainCode, data);
  return { privateKey: digest.slice(0, 32), chainCode: digest.slice(32) };
}

/**
 * Parse a derivation path into raw child indices.
 *
 * ed25519 in SLIP-0010 supports hardened steps only, so every segment must
 * carry the `'` marker; a non-hardened segment is rejected instead of silently
 * producing a different key than the caller expects.
 *
 * @param path - Path such as `m/44'/501'/0'/0'` (or bare `m`).
 * @returns Child indices, each offset into the hardened range.
 */
export function parsePath(path: string): number[] {
  if (path === "m") {
    return [];
  }
  if (!path.startsWith("m/")) {
    throw new Error(`invalid derivation path: ${JSON.stringify(path)}`);
  }
  return path
    .slice(2)
    .split("/")
    .map((segment) => {
      const hardened = segment.endsWith("'");
      const digits = hardened ? segment.slice(0, -1) : segment;
      const value = Number(digits);
      if (!hardened || !Number.isInteger(value) || value < 0 || value >= HARDENED_OFFSET) {
        throw new Error(
          `invalid SLIP-0010 segment ${JSON.stringify(segment)} in ${JSON.stringify(path)} ` +
            "(ed25519 supports hardened segments only, e.g. 44')",
        );
      }
      return value + HARDENED_OFFSET;
    });
}

/**
 * Derive an ed25519 node from a seed by following a hardened path.
 *
 * @param seed - 64-byte BIP-39 seed.
 * @param path - Path such as `m/44'/501'/0'/0'`.
 * @returns The derived node.
 */
export function derivePath(seed: Uint8Array, path: string): Slip10Node {
  let node = masterNode(seed);
  for (const index of parsePath(path)) {
    node = childNode(node, index);
  }
  return node;
}
