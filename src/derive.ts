/**
 * One recovery phrase, four accounts: the derivation core of the demo.
 *
 * A MetaMask multichain account is not four wallets. It is one BIP-39 seed
 * walked down four BIP-44/SLIP-0010 paths, two of them on secp256k1 and one on
 * ed25519:
 *
 * | Chain            | Curve      | Path                |
 * | ---------------- | ---------- | ------------------- |
 * | EVM (9 networks) | secp256k1  | `m/44'/60'/0'/0/0`  |
 * | Bitcoin (BIP-84) | secp256k1  | `m/84'/0'/0'/0/0`   |
 * | Solana           | ed25519    | `m/44'/501'/0'/0'`  |
 * | TRON             | secp256k1  | `m/44'/195'/0'/0/0` |
 *
 * The table is the whole story: same seed, four branches, four keys. The EVM
 * branch alone serves every EVM network because they all accept the same
 * secp256k1 account — which is why 12 networks collapse to 4 addresses.
 */

import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  toBitcoinNativeSegwitAddress,
  toEvmAddress,
  toSolanaAddress,
  toTronAddress,
} from "./address.ts";
import { derivePath } from "./slip10.ts";

/** Elliptic curve a derivation branch uses. */
export type Curve = "secp256k1" | "ed25519";

/** One derived account and the branch that produced it. */
export interface ChainAccount {
  /** Stable identifier, e.g. `evm`. */
  readonly chain: string;
  /** Human-readable name, e.g. `Bitcoin (native SegWit)`. */
  readonly name: string;
  /** Networks this single account serves. */
  readonly networks: readonly string[];
  /** Curve the branch is derived on. */
  readonly curve: Curve;
  /** BIP-44/SLIP-0010 derivation path. */
  readonly path: string;
  /** Encoded address for the chain. */
  readonly address: string;
  /** Hex-encoded private key (no `0x`). Handle with care. */
  readonly privateKey: string;
}

/** A chain branch: everything that differs between the four accounts. */
interface ChainSpec {
  readonly chain: string;
  readonly name: string;
  readonly networks: readonly string[];
  readonly curve: Curve;
  readonly path: string;
  readonly address: (privateKey: Uint8Array) => string;
}

/**
 * EVM networks the EVM branch serves — nine networks, one account.
 *
 * This is the list a real MetaMask multichain account exposes: Ethereum and
 * Linea (Consensys's own zk-rollup), Base, Arbitrum One, BNB Chain, OP Mainnet,
 * Polygon, Monad (a parallel-EVM L1), and Arc (Circle's stablecoin-focused
 * EVM-compatible L1). Nine different chains, one secp256k1 account.
 */
export const EVM_NETWORKS: readonly string[] = [
  "Ethereum",
  "Linea",
  "Base",
  "Arbitrum One",
  "BNB Chain",
  "OP Mainnet",
  "Polygon",
  "Monad",
  "Arc",
];

/** The four derivation branches, in the order the video presents them. */
export const CHAINS: readonly ChainSpec[] = [
  {
    chain: "evm",
    name: "EVM account",
    networks: EVM_NETWORKS,
    curve: "secp256k1",
    path: "m/44'/60'/0'/0/0",
    address: toEvmAddress,
  },
  {
    chain: "bitcoin",
    name: "Bitcoin (native SegWit)",
    networks: ["Bitcoin"],
    curve: "secp256k1",
    path: "m/84'/0'/0'/0/0",
    address: toBitcoinNativeSegwitAddress,
  },
  {
    chain: "solana",
    name: "Solana",
    networks: ["Solana"],
    curve: "ed25519",
    path: "m/44'/501'/0'/0'",
    address: toSolanaAddress,
  },
  {
    chain: "tron",
    name: "TRON",
    networks: ["TRON"],
    curve: "secp256k1",
    path: "m/44'/195'/0'/0/0",
    address: toTronAddress,
  },
];

/** Total number of networks the four accounts cover. */
export const NETWORK_COUNT = EVM_NETWORKS.length + 3;

/** Normalize a phrase to single-space, trimmed form before validating it. */
function normalizeMnemonic(mnemonic: string): string {
  return mnemonic.trim().replace(/\s+/g, " ");
}

/**
 * Derive all four chain accounts from one recovery phrase.
 *
 * @param mnemonic - BIP-39 English mnemonic (12–24 words).
 * @param passphrase - Optional BIP-39 passphrase (the "25th word").
 * @returns One account per chain branch, in {@link CHAINS} order.
 * @throws Error when the mnemonic fails BIP-39 validation.
 */
export function deriveAccounts(mnemonic: string, passphrase = ""): ChainAccount[] {
  const phrase = normalizeMnemonic(mnemonic);
  if (!validateMnemonic(phrase, wordlist)) {
    throw new Error("invalid BIP-39 mnemonic (expected English words and a valid checksum)");
  }
  const seed = mnemonicToSeedSync(phrase, passphrase);
  const secpRoot = HDKey.fromMasterSeed(seed);

  return CHAINS.map((spec) => {
    const privateKey =
      spec.curve === "ed25519"
        ? derivePath(seed, spec.path).privateKey
        : secpRoot.derive(spec.path).privateKey;
    if (!privateKey) {
      throw new Error(`derivation produced no private key for ${spec.chain}`);
    }
    return {
      chain: spec.chain,
      name: spec.name,
      networks: spec.networks,
      curve: spec.curve,
      path: spec.path,
      address: spec.address(privateKey),
      privateKey: bytesToHex(privateKey),
    };
  });
}

/**
 * Derive the BIP-39 seed itself (kept separate so tests can pin the official
 * BIP-39 vectors without touching the chain table).
 *
 * @param mnemonic - BIP-39 English mnemonic.
 * @param passphrase - Optional BIP-39 passphrase.
 * @returns 64-byte seed.
 */
export function seedFromMnemonic(mnemonic: string, passphrase = ""): Uint8Array {
  return mnemonicToSeedSync(normalizeMnemonic(mnemonic), passphrase);
}
