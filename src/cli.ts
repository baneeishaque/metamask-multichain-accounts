/**
 * Command-line entry point: one recovery phrase in, four accounts out.
 *
 * Everything is computed locally — the phrase is never sent anywhere. The
 * default input is the public BIP-39 test phrase, so a bare `npm run derive`
 * is always safe to run; a personal phrase arrives via `--mnemonic` or the
 * `METAMASK_MNEMONIC` environment variable and never gets echoed back.
 */

import { deriveAccounts } from "./derive.ts";
import { renderAccounts, renderAccountsJson, type ReportOptions } from "./report.ts";
import { TEST_MNEMONIC } from "./vectors.ts";

/** Parsed command-line options. */
interface CliOptions extends ReportOptions {
  readonly mnemonic: string;
  readonly passphrase: string;
  readonly json: boolean;
  readonly explicitMnemonic: boolean;
}

const USAGE = `Derive the four MetaMask accounts (EVM, Bitcoin, Solana, TRON) from one BIP-39 phrase.

Usage:
  npm run derive -- [options]

Options:
  --mnemonic <phrase>    Recovery phrase (default: the public BIP-39 test phrase,
                         which has never held funds). May also be provided via
                         the METAMASK_MNEMONIC environment variable.
  --passphrase <word>    Optional BIP-39 passphrase (the "25th word").
  --show-private-keys    Include each account's private key in the output.
  --json                 Machine-readable JSON instead of the table.
  -h, --help             Show this help.

The phrase never leaves this process: no network calls, no logs.`;

/** Human-readable message for an unknown thrown value. */
function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Parse argv into options.
 *
 * @param argv - Arguments after the script name.
 * @returns Parsed options, or the string `help` when help was requested.
 * @throws Error on unknown flags or missing values.
 */
function parseArgs(argv: readonly string[]): CliOptions | "help" {
  const environmentMnemonic = process.env["METAMASK_MNEMONIC"];
  const options = {
    mnemonic: environmentMnemonic ?? TEST_MNEMONIC,
    explicitMnemonic: environmentMnemonic !== undefined,
    passphrase: "",
    showPrivateKeys: false,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index] ?? "";
    if (argument === "--help" || argument === "-h") {
      return "help";
    }
    if (argument === "--json") {
      options.json = true;
      continue;
    }
    if (argument === "--show-private-keys") {
      options.showPrivateKeys = true;
      continue;
    }
    const equals = argument.indexOf("=");
    const name = equals === -1 ? argument : argument.slice(0, equals);
    const inlineValue = equals === -1 ? undefined : argument.slice(equals + 1);
    const takeValue = (): string => {
      if (inlineValue !== undefined) {
        return inlineValue;
      }
      index += 1;
      const value = argv[index];
      if (value === undefined) {
        throw new Error(`missing value for ${name}`);
      }
      return value;
    };
    if (name === "--mnemonic") {
      options.mnemonic = takeValue();
      options.explicitMnemonic = true;
      continue;
    }
    if (name === "--passphrase") {
      options.passphrase = takeValue();
      continue;
    }
    throw new Error(`unknown option: ${argument}`);
  }
  return options;
}

/** Run the CLI and return the process exit code. */
function main(): number {
  let parsed: CliOptions | "help";
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${messageOf(error)}`);
    console.error(USAGE);
    return 1;
  }
  if (parsed === "help") {
    console.log(USAGE);
    return 0;
  }

  try {
    const accounts = deriveAccounts(parsed.mnemonic, parsed.passphrase);
    if (parsed.json) {
      console.log(renderAccountsJson(accounts, parsed));
      return 0;
    }
    if (!parsed.explicitMnemonic) {
      console.error(
        "note: deriving from the public BIP-39 test phrase (never funded). " +
          "Pass --mnemonic or set METAMASK_MNEMONIC to use your own.",
      );
    }
    if (parsed.showPrivateKeys) {
      console.error(
        "warning: private keys are about to be printed. Never share them, and " +
          "never paste a funded recovery phrase into any tool.",
      );
    }
    console.log("MetaMask multichain accounts — one recovery phrase, four accounts");
    console.log("");
    console.log(renderAccounts(accounts, parsed));
    return 0;
  } catch (error) {
    console.error(`error: ${messageOf(error)}`);
    return 1;
  }
}

process.exitCode = main();
