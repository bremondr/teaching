#!/usr/bin/env python3
"""Keeps the teaching hub tidy. Run it before every commit:

    python3 scripts/check.py            # errors fail, warnings are listed
    python3 scripts/check.py --strict   # warnings fail too

It uses only the standard library. It checks:
  1. topics/topics.json: required fields, allowed type and language codes, tag style,
     and that every available link points to something that exists in the repo.
  2. Item folders (lectures/, workshops/, templates/): each has a README.md with front
     matter (title, type, description), is linked from topics.json, and the card in
     topics.json agrees with the README (see scripts/sync_topics.py).
  3. File hygiene for tracked files: ASCII file names without spaces or Windows-unsafe
     characters, no case-only duplicates, no archives or videos, size limits.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TYPES = {"lecture", "workshop", "template"}
TYPE_DIRS = {"lectures": "lecture", "workshops": "workshop", "templates": "template"}
LANGS = {"en", "cs", "sk", "es", "de", "fr", "pl"}
REQUIRED = ["title", "type", "category", "tags", "languages", "status", "description", "resources"]
BAD_EXT = {".zip", ".7z", ".rar", ".mov", ".mp4", ".avi", ".psd", ".key"}
WARN_EXT = {".pptx", ".docx", ".xlsx"}
FILE_WARN = 2 * 1024 * 1024      # a single file over 2 MB: warning
FILE_ERR = 10 * 1024 * 1024      # a single file over 10 MB: error
ITEM_WARN = 25 * 1024 * 1024     # an item folder over 25 MB: warning
UNSAFE = re.compile(r'[:?"*<>|\\\s]')

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def tracked_files():
    out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True)
    if out.returncode != 0:
        return [p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts]
    names = [n for n in out.stdout.splitlines() if n]
    # include files that are added but not yet committed
    new = subprocess.run(["git", "ls-files", "--others", "--exclude-standard"], cwd=ROOT, capture_output=True, text=True)
    names += [n for n in new.stdout.splitlines() if n]
    return sorted(set(n for n in names if (ROOT / n).is_file()))


def check_topics():
    path = ROOT / "topics" / "topics.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err(f"topics/topics.json cannot be read: {e}")
        return set(), set()
    linked = set()
    hrefs = set()
    titles = set()
    for i, t in enumerate(data.get("topics", [])):
        name = t.get("title", f"entry {i + 1}")
        for key in REQUIRED:
            if key not in t:
                err(f"{name}: missing field '{key}'")
        if t.get("type") not in TYPES:
            err(f"{name}: type must be one of {sorted(TYPES)}")
        if name in titles:
            err(f"{name}: duplicate title")
        titles.add(name)
        for tag in t.get("tags", []):
            if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", tag):
                err(f"{name}: tag '{tag}' must be lowercase words joined by hyphens")
        for lang in t.get("languages", []):
            if lang not in LANGS:
                err(f"{name}: language '{lang}' is not in {sorted(LANGS)} (add it to app.js and to this script)")
        for r in t.get("resources", []):
            for key in ("label", "href", "available"):
                if key not in r:
                    err(f"{name}: a resource is missing '{key}'")
            href = r.get("href", "")
            hrefs.add(href)
            if r.get("available") and href in ("", "#"):
                err(f"{name}: resource '{r.get('label')}' is marked available but has no link")
            if href.startswith(("http://", "https://")):
                continue
            if href and href != "#":
                target = (ROOT / href.split("#")[0].split("?")[0]).resolve()
                try:
                    rel = target.relative_to(ROOT).as_posix()
                except ValueError:
                    err(f"{name}: link '{href}' points outside the repo")
                    continue
                linked.add(rel.rstrip("/"))
                if r.get("available") and not target.exists():
                    warn(f"{name}: link '{href}' points to a path that is not in the repo")
    return linked, hrefs


def check_items(linked, files, hrefs):
    for folder, kind in TYPE_DIRS.items():
        base = ROOT / folder
        if not base.is_dir():
            continue
        for item in sorted(p for p in base.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))):
            rel = item.relative_to(ROOT).as_posix()
            if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", item.name):
                err(f"{rel}: folder name must be lowercase ASCII words joined by hyphens")
            readme = item / "README.md"
            if not readme.is_file():
                err(f"{rel}: missing README.md")
            else:
                text = readme.read_text(encoding="utf-8")
                m = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.S)
                if not m:
                    warn(f"{rel}/README.md: no front matter; the hub card and the page header need it (copy _template/README.md)")
                else:
                    keys = {line.split(":", 1)[0].strip() for line in m.group(1).splitlines() if ":" in line}
                    for key in ("title", "type", "description"):
                        if key not in keys:
                            err(f"{rel}/README.md: front matter is missing '{key}'")
                    t = re.search(r"^type:\s*(\S+)", m.group(1), re.M)
                    if t and t.group(1) != kind:
                        err(f"{rel}/README.md: front matter type '{t.group(1)}' does not match the folder ({kind})")
            if not any(l == rel or l.startswith(rel + "/") for l in linked):
                warn(f"{rel}: not linked from topics/topics.json")
            # every PDF in print/ must be reachable from the hub card or the item README
            readme_text = readme.read_text(encoding="utf-8") if readme.is_file() else ""
            for f in files:
                if f.startswith(rel + "/print/") and f.lower().endswith(".pdf"):
                    name = Path(f).name
                    if not any(h.endswith(name) for h in hrefs) and name not in readme_text:
                        warn(f"{f}: not linked from the hub card or from {rel}/README.md")
            total = sum((ROOT / f).stat().st_size for f in files if f.startswith(rel + "/"))
            if total > ITEM_WARN:
                warn(f"{rel}: {total // (1024 * 1024)} MB in total; keep an item under {ITEM_WARN // (1024 * 1024)} MB")


def check_files(files):
    seen = {}
    for f in files:
        p = ROOT / f
        name = Path(f).name
        if not f.isascii():
            err(f"{f}: file path must be ASCII (no diacritics)")
        if UNSAFE.search(f):
            err(f"{f}: file path has a space or a character that Windows does not allow")
        if name.endswith((".", " ")):
            err(f"{f}: file name must not end with a dot or a space")
        low = f.lower()
        if low in seen and seen[low] != f:
            err(f"{f}: differs from {seen[low]} only in letter case")
        seen[low] = f
        if p.suffix.lower() in BAD_EXT:
            err(f"{f}: {p.suffix} files do not belong in the repo (export to PDF or web formats)")
        if p.suffix.lower() in WARN_EXT:
            warn(f"{f}: office files are heavy and hard to review; keep the source elsewhere and commit the PDF")
        size = p.stat().st_size
        if size > FILE_ERR:
            err(f"{f}: {size // (1024 * 1024)} MB is too large; shrink it or host it elsewhere")
        elif size > FILE_WARN:
            warn(f"{f}: {size / (1024 * 1024):.1f} MB; consider shrinking it")


def check_pages():
    # GitHub Pages runs Jekyll unless this file exists. Jekyll turns every Markdown file that has
    # front matter into HTML and stops serving the raw .md, so readme.html could not load it.
    if not (ROOT / ".nojekyll").is_file():
        err(".nojekyll is missing: GitHub Pages would turn the README files into HTML and readme.html could not load them")


def main():
    strict = "--strict" in sys.argv
    check_pages()
    files = tracked_files()
    linked, hrefs = check_topics()
    check_items(linked, files, hrefs)
    check_files(files)
    sync = subprocess.run([sys.executable, str(ROOT / "scripts" / "sync_topics.py"), "--check"], capture_output=True, text=True)
    if sync.returncode != 0:
        err("topics/topics.json is out of line with the item READMEs. Run: python3 scripts/sync_topics.py")
    for w in warnings:
        print("WARN ", w)
    for e in errors:
        print("ERROR", e)
    if errors or (strict and warnings):
        print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
        sys.exit(1)
    print(f"OK: {len(files)} files checked, {len(warnings)} warning(s)")


if __name__ == "__main__":
    main()
