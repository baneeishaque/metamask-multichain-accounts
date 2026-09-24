import { describe, expect, it } from "vitest";
import { deriveAccounts } from "../src/derive.ts";
import { renderAccounts, renderAccountsJson } from "../src/report.ts";
import { TEST_ADDRESSES, TEST_MNEMONIC } from "../src/vectors.ts";

const accounts = deriveAccounts(TEST_MNEMONIC);

describe("renderAccounts", () => {
  it("shows every address and the 12 → 4 → 1 summary", () => {
    const text = renderAccounts(accounts);
    for (const address of Object.values(TEST_ADDRESSES)) {
      expect(text).toContain(address);
    }
    expect(text).toContain("12 networks → 4 accounts → 4 keys from 1 recovery phrase.");
  });

  it("hides private keys by default and shows them on request", () => {
    expect(renderAccounts(accounts)).not.toContain(accounts[0]?.privateKey);
    expect(renderAccounts(accounts, { showPrivateKeys: true })).toContain(accounts[0]?.privateKey);
  });
});

describe("renderAccountsJson", () => {
  it("emits parseable JSON with the four chains and no private keys", () => {
    const parsed = JSON.parse(renderAccountsJson(accounts)) as Array<Record<string, unknown>>;
    expect(parsed.map((entry) => entry["chain"])).toEqual(["evm", "bitcoin", "solana", "tron"]);
    expect(parsed[0]?.["privateKey"]).toBeUndefined();
  });

  it("includes private keys only when asked", () => {
    const parsed = JSON.parse(renderAccountsJson(accounts, { showPrivateKeys: true })) as Array<
      Record<string, unknown>
    >;
    expect(typeof parsed[0]?.["privateKey"]).toBe("string");
  });
});
