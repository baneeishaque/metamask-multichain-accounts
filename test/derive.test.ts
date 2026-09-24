import { bytesToHex } from "@noble/hashes/utils.js";
import { describe, expect, it } from "vitest";
import {
  CHAINS,
  deriveAccounts,
  EVM_NETWORKS,
  NETWORK_COUNT,
  seedFromMnemonic,
} from "../src/derive.ts";
import {
  TEST_ADDRESSES,
  TEST_MNEMONIC,
  TEST_PASSPHRASE,
  TEST_SEED_HEX,
  TEST_SEED_NO_PASSPHRASE_HEX,
} from "../src/vectors.ts";

describe("seed derivation (official BIP-39 vectors)", () => {
  it("matches the no-passphrase seed", () => {
    expect(bytesToHex(seedFromMnemonic(TEST_MNEMONIC))).toBe(TEST_SEED_NO_PASSPHRASE_HEX);
  });

  it("matches the TREZOR-passphrase seed", () => {
    expect(bytesToHex(seedFromMnemonic(TEST_MNEMONIC, TEST_PASSPHRASE))).toBe(TEST_SEED_HEX);
  });

  it("changes every account when a passphrase is added", () => {
    const plain = deriveAccounts(TEST_MNEMONIC);
    const withPassphrase = deriveAccounts(TEST_MNEMONIC, TEST_PASSPHRASE);
    plain.forEach((account, index) => {
      expect(withPassphrase[index]?.address).not.toBe(account.address);
    });
  });
});

describe("deriveAccounts", () => {
  it("returns the four chain accounts in table order", () => {
    expect(deriveAccounts(TEST_MNEMONIC).map((account) => account.chain)).toEqual([
      "evm",
      "bitcoin",
      "solana",
      "tron",
    ]);
  });

  it("pins every branch's chain, path, and curve", () => {
    expect(CHAINS.map(({ chain, path, curve }) => ({ chain, path, curve }))).toEqual([
      { chain: "evm", path: "m/44'/60'/0'/0/0", curve: "secp256k1" },
      { chain: "bitcoin", path: "m/84'/0'/0'/0/0", curve: "secp256k1" },
      { chain: "solana", path: "m/44'/501'/0'/0'", curve: "ed25519" },
      { chain: "tron", path: "m/44'/195'/0'/0/0", curve: "secp256k1" },
    ]);
  });

  it("matches the published address vectors", () => {
    const addresses = Object.fromEntries(
      deriveAccounts(TEST_MNEMONIC).map((account) => [account.chain, account.address]),
    );
    expect(addresses).toEqual(TEST_ADDRESSES);
  });

  it("covers 12 networks with 9 EVM chains on one account", () => {
    expect(EVM_NETWORKS).toHaveLength(9);
    expect(NETWORK_COUNT).toBe(12);
    expect(new Set(EVM_NETWORKS).size).toBe(EVM_NETWORKS.length);
  });

  it("gives every account a 32-byte private key", () => {
    for (const account of deriveAccounts(TEST_MNEMONIC)) {
      expect(account.privateKey).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("normalizes whitespace before validating", () => {
    const messy = `  ${TEST_MNEMONIC.replace(/ /g, "  ")}\n`;
    expect(deriveAccounts(messy)[0]?.address).toBe(TEST_ADDRESSES.evm);
  });

  it("rejects an invalid mnemonic", () => {
    expect(() => deriveAccounts("abandon abandon abandon")).toThrow(/invalid BIP-39 mnemonic/);
  });

  it("rejects a mnemonic with a broken checksum", () => {
    expect(() => deriveAccounts(TEST_MNEMONIC.replace(/about$/, "abandon"))).toThrow(
      /invalid BIP-39 mnemonic/,
    );
  });
});
