/**
 * Public test vectors shared by the demo and the test suite.
 *
 * These are the canonical BIP-39/BIP-84 test phrases: published in the
 * specifications themselves, reproduced by every wallet test suite, and never
 * funded. Anything derived from them is public by definition — which is
 * exactly why they, and not a personal phrase, power the demo and the docs.
 */

/** The canonical BIP-39 test phrase ("abandon … about"). */
export const TEST_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

/** BIP-39 passphrase used by the official specification vectors. */
export const TEST_PASSPHRASE = "TREZOR";

/** Official BIP-39 seed for {@link TEST_MNEMONIC} + {@link TEST_PASSPHRASE}. */
export const TEST_SEED_HEX =
  "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e5349553" +
  "1f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04";

/**
 * Seed for {@link TEST_MNEMONIC} with no passphrase. Computed with an
 * independent PBKDF2 implementation during repository construction and
 * cross-checked against the widely published value.
 */
export const TEST_SEED_NO_PASSPHRASE_HEX =
  "5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc1" +
  "9a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4";

/**
 * Expected addresses of {@link TEST_MNEMONIC} (no passphrase), one per branch.
 *
 * - `evm`: canonical `m/44'/60'/0'/0/0` fixture for this phrase.
 * - `bitcoin`: official BIP-84 test vector.
 * - `solana`: canonical SLIP-0010 `m/44'/501'/0'/0'` fixture, cross-checked
 *   with `ed25519-hd-key` + Node's native ed25519 during construction.
 * - `tron`: canonical `m/44'/195'/0'/0/0` fixture, cross-checked with TronWeb.
 */
export const TEST_ADDRESSES = {
  evm: "0x9858EfFD232B4033E47d90003D41EC34EcaEda94",
  bitcoin: "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
  solana: "HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk",
  tron: "TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH",
} as const;
