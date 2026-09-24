/**
 * Rendering of derived accounts — one aligned human table and one JSON shape.
 *
 * Kept separate from the CLI so the formatting is unit-testable and the CLI
 * stays a thin argument parser.
 */

import { NETWORK_COUNT, type ChainAccount } from "./derive.ts";

/** What to include in a report. */
export interface ReportOptions {
  /** Include each account's private key (off by default). */
  readonly showPrivateKeys?: boolean;
}

/** Column width of the account-name column in the human table. */
const NAME_WIDTH = 24;

/** Column width of the derivation-path column in the human table. */
const PATH_WIDTH = 20;

/** Render one account as one aligned block of lines. */
function renderAccount(account: ChainAccount, options: ReportOptions): string[] {
  const lines = [
    `  ${account.name.padEnd(NAME_WIDTH)}${account.path.padEnd(PATH_WIDTH)}${account.address}`,
    `    ${account.curve} · ${account.networks.join(", ")}`,
  ];
  if (options.showPrivateKeys) {
    lines.push(`    private key: ${account.privateKey}`);
  }
  return lines;
}

/**
 * Render the accounts as an aligned human-readable table.
 *
 * @param accounts - Accounts from `deriveAccounts`.
 * @param options - Include private keys or not.
 * @returns Multi-line report text (no trailing newline).
 */
export function renderAccounts(
  accounts: readonly ChainAccount[],
  options: ReportOptions = {},
): string {
  const lines = accounts.flatMap((account) => [...renderAccount(account, options), ""]);
  lines.push(
    `${NETWORK_COUNT} networks → ${accounts.length} accounts → ${accounts.length} keys ` +
      "from 1 recovery phrase.",
  );
  return lines.join("\n");
}

/**
 * Render the accounts as machine-readable JSON.
 *
 * @param accounts - Accounts from `deriveAccounts`.
 * @param options - Include private keys or not.
 * @returns Pretty-printed JSON array.
 */
export function renderAccountsJson(
  accounts: readonly ChainAccount[],
  options: ReportOptions = {},
): string {
  const payload = accounts.map((account) => ({
    chain: account.chain,
    name: account.name,
    networks: account.networks,
    curve: account.curve,
    path: account.path,
    address: account.address,
    ...(options.showPrivateKeys ? { privateKey: account.privateKey } : {}),
  }));
  return JSON.stringify(payload, null, 2);
}
