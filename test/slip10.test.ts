import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { describe, expect, it } from "vitest";
import { derivePath, parsePath } from "../src/slip10.ts";

// Official SLIP-0010 ed25519 test vectors, reproduced from the specification
// (github.com/satoshilabs/slips/blob/master/slip-0010.md).

const VECTOR_1_SEED = "000102030405060708090a0b0c0d0e0f";
const VECTOR_2_SEED =
  "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a" +
  "8784817e7b7875726f6c696663605d5a5754514e4b484542";

interface Slip10Vector {
  readonly seed: string;
  readonly path: string;
  readonly chainCode: string;
  readonly privateKey: string;
}

const VECTORS: readonly Slip10Vector[] = [
  {
    seed: VECTOR_1_SEED,
    path: "m",
    chainCode: "90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb",
    privateKey: "2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7",
  },
  {
    seed: VECTOR_1_SEED,
    path: "m/0'",
    chainCode: "8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69",
    privateKey: "68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3",
  },
  {
    seed: VECTOR_1_SEED,
    path: "m/0'/1'",
    chainCode: "a320425f77d1b5c2505a6b1b27382b37368ee640e3557c315416801243552f14",
    privateKey: "b1d0bad404bf35da785a64ca1ac54b2617211d2777696fbffaf208f746ae84f2",
  },
  {
    seed: VECTOR_1_SEED,
    path: "m/0'/1'/2'",
    chainCode: "2e69929e00b5ab250f49c3fb1c12f252de4fed2c1db88387094a0f8c4c9ccd6c",
    privateKey: "92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9",
  },
  {
    seed: VECTOR_1_SEED,
    path: "m/0'/1'/2'/2'",
    chainCode: "8f6d87f93d750e0efccda017d662a1b31a266e4a6f5993b15f5c1f07f74dd5cc",
    privateKey: "30d1dc7e5fc04c31219ab25a27ae00b50f6fd66622f6e9c913253d6511d1e662",
  },
  {
    seed: VECTOR_1_SEED,
    path: "m/0'/1'/2'/2'/1000000000'",
    chainCode: "68789923a0cac2cd5a29172a475fe9e0fb14cd6adb5ad98a3fa70333e7afa230",
    privateKey: "8f94d394a8e8fd6b1bc2f3f49f5c47e385281d5c17e65324b0f62483e37e8793",
  },
  {
    seed: VECTOR_2_SEED,
    path: "m",
    chainCode: "ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b",
    privateKey: "171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012",
  },
  {
    seed: VECTOR_2_SEED,
    path: "m/0'",
    chainCode: "0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d",
    privateKey: "1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635",
  },
];

describe("SLIP-0010 ed25519 derivation", () => {
  it.each(VECTORS)("matches the official vector at $path", (vector) => {
    const node = derivePath(hexToBytes(vector.seed), vector.path);
    expect(bytesToHex(node.privateKey)).toBe(vector.privateKey);
    expect(bytesToHex(node.chainCode)).toBe(vector.chainCode);
  });
});

describe("SLIP-0010 path parsing", () => {
  it("treats bare m as the master node", () => {
    expect(parsePath("m")).toEqual([]);
  });

  it("offsets hardened segments into the hardened range", () => {
    expect(parsePath("m/44'/501'/0'/0'")).toEqual([0x8000002c, 0x800001f5, 0x80000000, 0x80000000]);
  });

  it("rejects non-hardened segments", () => {
    expect(() => parsePath("m/44/501'")).toThrow(/hardened/);
  });

  it("rejects malformed paths", () => {
    expect(() => parsePath("44'/501'")).toThrow(/invalid derivation path/);
  });

  it("rejects negative and out-of-range indices", () => {
    expect(() => parsePath("m/-1'")).toThrow(/invalid SLIP-0010 segment/);
    expect(() => parsePath("m/2147483648'")).toThrow(/invalid SLIP-0010 segment/);
  });
});
