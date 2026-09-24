#!/usr/bin/env python3
"""Assemble ``scenes.json`` from the scene structure and per-locale translations.

The video kit covers thirty-seven locales, and a single hand-maintained
``scenes.json`` does not scale: a native speaker fixing one sentence would have
to edit a file thousands of lines long. Instead:

- ``build-scenes.py`` (this file) owns the *structure*: scene order, the
  on-screen code line of each scene, the voice map, and the meta block.
- ``translations/<locale>.json`` owns the *words*: one small file per locale,
  keyed by scene id, each with a ``title`` and a ``narration``.

This script merges the two into ``scenes.json`` — the file the rest of the
pipeline (``render-slides.mjs``, ``build-video.py``) reads. The output is
committed, but never edited by hand: edit the translations or the structure
table below and re-run.

Usage:
    python3 content/youtube/build-scenes.py           # regenerate scenes.json
    python3 content/youtube/build-scenes.py --check   # validate only, no write
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
TRANSLATIONS_DIR = HERE / "translations"
SCENES_FILE = HERE / "scenes.json"

META: dict[str, Any] = {
    "id": "metamask-multichain-accounts",
    "title": "12 networks, 4 accounts, 1 recovery phrase",
    "resolution": {"width": 1920, "height": 1080},
    "fps": 30,
    "leadInSeconds": 0.4,
    "tailSeconds": 1.4,
    "repoUrl": "github.com/baneeishaque-ompventure/metamask-multichain-accounts",
}

# Scene order and the shared on-screen code line. Code is intentionally not
# translated: it is the artifact every audience reads the same way.
SCENES: list[dict[str, str]] = [
    {"id": "intro", "code": "12 networks · 4 accounts · 1 phrase"},
    {"id": "problem", "code": "ethereum · linea · base · arbitrum · bnb · op · polygon · monad · arc · bitcoin · solana · tron"},
    {"id": "phrase-to-seed", "code": "PBKDF2-HMAC-SHA512(phrase, \"mnemonic\"+passphrase, 2048) → 64-byte seed"},
    {"id": "two-curves", "code": "secp256k1 → BIP-32 · ed25519 → SLIP-0010"},
    {"id": "paths", "code": "m/44'/60'/0'/0/0 · m/84'/0'/0'/0/0 · m/44'/501'/0'/0' · m/44'/195'/0'/0/0"},
    {"id": "solana-slip10", "code": "ed25519 → hardened-only → no xpubs"},
    {"id": "encodings", "code": "keccak+eip-55 · hash160+bech32 · base58 · 0x41+base58check"},
    {"id": "evm-shared", "code": "9 networks → 1 key · 0x9858EfFD232B4033E47d90003D41EC34EcaEda94"},
    {"id": "balances", "code": "eth · bnb · pol · mon — one address, nine ledgers"},
    {"id": "secrets", "code": "password = local vault · phrase = everything · key = one branch"},
    {"id": "verify", "code": "npm run derive → 4 addresses · pinned to official vectors"},
    {"id": "outro", "code": "github.com/baneeishaque-ompventure/metamask-multichain-accounts"},
]

# The 22 scheduled languages of India (alphabetical by code), English as the
# reference locale, then major world languages (alphabetical). One file per
# locale lives under translations/.
LOCALES: list[str] = [
    "en",
    "as",
    "bn",
    "brx",
    "doi",
    "gu",
    "hi",
    "kn",
    "kok",
    "ks",
    "mai",
    "ml",
    "mni",
    "mr",
    "ne",
    "or",
    "pa",
    "sa",
    "sat",
    "sd",
    "ta",
    "te",
    "ur",
    "ar",
    "de",
    "es",
    "fr",
    "id",
    "it",
    "ja",
    "ko",
    "pt",
    "ru",
    "th",
    "tr",
    "vi",
    "zh",
]

# macOS `say` voice per locale; ``None`` means no system voice ships, so the
# pipeline produces slides and subtitles but no narration for that locale.
VOICES: dict[str, str | None] = {
    "en": "Aman",
    "as": None,
    "bn": "Piya",
    "brx": None,
    "doi": None,
    "gu": None,
    "hi": "Lekha",
    "kn": "Soumya",
    "kok": None,
    "ks": None,
    "mai": None,
    "ml": None,
    "mni": None,
    "mr": None,
    "ne": None,
    "or": None,
    "pa": None,
    "sa": None,
    "sat": None,
    "sd": None,
    "ta": "Vani",
    "te": "Geeta",
    "ur": None,
    "ar": "Majed",
    "de": "Anna",
    "es": "Mónica",
    "fr": "Thomas",
    "id": "Damayanti",
    "it": "Alice",
    "ja": "Kyoko",
    "ko": "Yuna",
    "pt": "Luciana",
    "ru": "Milena",
    "th": "Kanya",
    "tr": "Yelda",
    "vi": "Linh",
    "zh": "Tingting",
}


def load_translations() -> dict[str, dict[str, dict[str, str]]]:
    """Load every ``translations/<locale>.json`` file.

    Returns:
        Map of locale to scene id to ``{"title", "narration"}``.
    """
    translations: dict[str, dict[str, dict[str, str]]] = {}
    for locale in LOCALES:
        path = TRANSLATIONS_DIR / f"{locale}.json"
        if not path.exists():
            sys.exit(f"error: missing translation file {path.relative_to(HERE.parent.parent)}")
        with path.open(encoding="utf-8") as handle:
            translations[locale] = json.load(handle)
    return translations


def validate(translations: dict[str, dict[str, dict[str, str]]]) -> list[str]:
    """Check every locale covers every scene with non-empty strings.

    Args:
        translations: Output of :func:`load_translations`.

    Returns:
        Sorted list of human-readable problems (empty when valid).
    """
    expected_ids = [scene["id"] for scene in SCENES]
    problems: list[str] = []
    for locale in LOCALES:
        entries = translations[locale]
        for scene_id in expected_ids:
            entry = entries.get(scene_id)
            if entry is None:
                problems.append(f"{locale}: missing scene '{scene_id}'")
                continue
            for field in ("title", "narration"):
                value = entry.get(field, "")
                if not isinstance(value, str) or not value.strip():
                    problems.append(f"{locale}/{scene_id}: empty {field}")
        for scene_id in entries:
            if scene_id not in expected_ids:
                problems.append(f"{locale}: unknown scene '{scene_id}'")
    return sorted(problems)


def assemble(translations: dict[str, dict[str, dict[str, str]]]) -> dict[str, Any]:
    """Merge structure and translations into the ``scenes.json`` document.

    Args:
        translations: Output of :func:`load_translations`.

    Returns:
        The complete document, ready to serialize.
    """
    scenes: list[dict[str, Any]] = []
    for scene in SCENES:
        scenes.append(
            {
                "id": scene["id"],
                "code": scene["code"],
                "title": {
                    locale: translations[locale][scene["id"]]["title"] for locale in LOCALES
                },
                "narration": {
                    locale: translations[locale][scene["id"]]["narration"] for locale in LOCALES
                },
            }
        )
    return {
        "meta": META,
        "voices": {locale: VOICES[locale] for locale in LOCALES},
        "scenes": scenes,
    }


def main() -> None:
    """Validate, assemble, and (unless ``--check``) write ``scenes.json``."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="validate without writing")
    args = parser.parse_args()

    translations = load_translations()
    problems = validate(translations)
    if problems:
        for problem in problems:
            print(f"error: {problem}", file=sys.stderr)
        sys.exit(f"error: {len(problems)} translation problem(s)")

    document = assemble(translations)
    if args.check:
        print(f"ok: {len(LOCALES)} locales × {len(SCENES)} scenes, no problems")
        return

    SCENES_FILE.write_text(
        json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    narrated = sum(1 for locale in LOCALES if VOICES[locale])
    print(
        f"[scenes] wrote {SCENES_FILE.name}: {len(LOCALES)} locales "
        f"({narrated} with narration) × {len(SCENES)} scenes"
    )


if __name__ == "__main__":
    main()
