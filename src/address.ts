/**
 * Address encodings for the four chain families one MetaMask recovery phrase
 * feeds. Every encoder starts from a derived private key, because the four
 * chains disagree on what happens next:
 *
 * - EVM and TRON share `keccak256(uncompressed_pubkey)[12:]` as the 20-byte
 *   account body; they differ only in how the body is presented (EIP-55 hex
 *   vs. base58check with a 0x41 version byte).
 * - Bitcoin's native SegWit address is bech32 over `HASH160(compressed_pubkey)`
 *   — a different key serialization and a different checksum alphabet.
 * - Solana uses ed25519, whose 32-byte public key *is* the address (base58).
 *
 * Reference: BIP-84 (Bitcoin), EIP-55 (EVM), SLIP-0010 (Solana), TIP
 * (TRON's `0x41` prefix and base58check).
 */

import { ed25519 } from "@noble/curves/ed25519.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex, concatBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { base58, base58check, bech32 } from "@scure/base";

/** Bitcoin mainnet human-readable part for native SegWit (BIP-84) addresses. */
const BITCOIN_HRP = "bc";

/** TRON's single address-version byte; it is why every TRON address starts with `T`. */
const TRON_PREFIX = 0x41;

/** bech32's BIP-173 length limit for witness programs. */
const BECH32_LIMIT = 90;

/** HASH160 = RIPEMD-160(SHA-256(data)), Bitcoin's classic 20-byte digest. */
export function hash160(data: Uint8Array): Uint8Array {
  return ripemd160(sha256(data));
}

/**
 * Apply the EIP-55 mixed-case checksum to a 20-byte lowercase hex address.
 *
 * @param addressHex - 40 lowercase hex characters (no `0x` prefix).
 * @returns The same address with checksum-defining characters uppercased.
 */
export function toEip55Checksum(addressHex: string): string {
  const lower = addressHex.toLowerCase();
  const hash = keccak_256(utf8ToBytes(lower));
  let checksummed = "";
  for (let index = 0; index < lower.length; index += 1) {
    const byte = hash[index >> 1] ?? 0;
    const nibble = index % 2 === 0 ? byte >> 4 : byte & 0x0f;
    const character = lower[index] ?? "";
    checksummed += nibble >= 8 ? character.toUpperCase() : character;
  }
  return checksummed;
}

/** Uncompressed secp256k1 public key, without the `0x04` tag (64 bytes). */
function uncompressedPublicKey(privateKey: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(privateKey, false).slice(1);
}

/** Compressed secp256k1 public key (33 bytes). */
function compressedPublicKey(privateKey: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(privateKey, true);
}

/** The 20-byte account body shared by EVM and TRON addresses. */
function keccakAddressBody(privateKey: Uint8Array): Uint8Array {
  return keccak_256(uncompressedPublicKey(privateKey)).slice(-20);
}

/**
 * Derive the EIP-55 checksummed EVM address (`0x…`) for a secp256k1 key.
 *
 * @param privateKey - 32-byte secp256k1 private key.
 * @returns Checksummed address, e.g. `0x9858EfFD232B4033E47d90003D41EC34EcaEda94`.
 */
export function toEvmAddress(privateKey: Uint8Array): string {
  return `0x${toEip55Checksum(bytesToHex(keccakAddressBody(privateKey)))}`;
}

/**
 * Derive the Bitcoin native SegWit (BIP-84, P2WPKH) address for a key.
 *
 * @param privateKey - 32-byte secp256k1 private key.
 * @returns bech32 address, e.g. `bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu`.
 */
export function toBitcoinNativeSegwitAddress(privateKey: Uint8Array): string {
  const digest = hash160(compressedPublicKey(privateKey));
  return bech32.encode(BITCOIN_HRP, [0, ...bech32.toWords(digest)], BECH32_LIMIT);
}

/**
 * Derive the Solana address for an ed25519 key.
 *
 * @param privateKey - 32-byte ed25519 seed (SLIP-0010 node key).
 * @returns base58 address, e.g. `HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk`.
 */
export function toSolanaAddress(privateKey: Uint8Array): string {
  return base58.encode(ed25519.getPublicKey(privateKey));
}

/**
 * Derive the TRON address for a secp256k1 key.
 *
 * @param privateKey - 32-byte secp256k1 private key.
 * @returns base58check address starting with `T`.
 */
export function toTronAddress(privateKey: Uint8Array): string {
  const body = concatBytes(new Uint8Array([TRON_PREFIX]), keccakAddressBody(privateKey));
  return base58check(sha256).encode(body);
}
