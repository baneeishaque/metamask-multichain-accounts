import { describe, expect, it } from "vitest";
import { toEip55Checksum } from "../src/address.ts";
import { deriveAccounts } from "../src/derive.ts";
import { TEST_ADDRESSES, TEST_MNEMONIC } from "../src/vectors.ts";

const accounts = deriveAccounts(TEST_MNEMONIC);
const byChain = new Map(accounts.map((account) => [account.chain, account]));

describe("EIP-55 checksumming", () => {
  // Official EIP-55 test vectors (ethereum/ercs ERC-55).
  it.each([
    "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    "0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB",
    "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
  ])("reproduces the official vector %s", (address) => {
    expect(`0x${toEip55Checksum(address.slice(2).toLowerCase())}`).toBe(address);
  });
});

describe("chain address encoders (public test phrase)", () => {
  it("encodes the EVM branch at m/44'/60'/0'/0/0", () => {
    expect(byChain.get("evm")?.address).toBe(TEST_ADDRESSES.evm);
  });

  it("encodes the Bitcoin branch at m/84'/0'/0'/0/0 (official BIP-84 vector)", () => {
    expect(byChain.get("bitcoin")?.address).toBe(TEST_ADDRESSES.bitcoin);
  });

  it("encodes the Solana branch at m/44'/501'/0'/0'", () => {
    expect(byChain.get("solana")?.address).toBe(TEST_ADDRESSES.solana);
  });

  it("encodes the TRON branch at m/44'/195'/0'/0/0", () => {
    expect(byChain.get("tron")?.address).toBe(TEST_ADDRESSES.tron);
  });
});
