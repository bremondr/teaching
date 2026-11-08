#!/usr/bin/env python3
"""Keeps topics/topics.json in line with the item READMEs, so the README is the single
description of an item.

    python3 scripts/sync_topics.py          # update topics.json
    python3 scripts/sync_topics.py --check  # only report; exit 1 if it would change

Every folder under lectures/, workshops/ and templates/ whose README.md starts with
front matter (a block between two lines of ---) is an item. For each item:
  - the hub card fields (title, type, category, tags, languages, level, status,
    description) are copied from the front matter;
  - if no card exists yet, one is added at the top, with an "open" link (front matter
    key `open`, optional `open_label`) and a README link;
  - the resources of an existing card are kept; a README link is added if missing.
Cards without a folder (placeholders) are left alone. Standard library only.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TYPE_DIRS = {"lectures": "lecture", "workshops": "workshop", "templates": "template"}
FIELDS = ["title", "type", "category", "course", "tags", "languages", "level", "status", "description"]
LIST_FIELDS = {"tags", "languages"}


def front_matter(text):
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?", text, re.S)
    if not m:
        return None
    meta = {}
    for line in m.group(1).splitlines():
        kv = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
        if not kv:
            continue
        value = kv.group(2).strip()
        if value.startswith("[") and value.endswith("]"):
            value = [v.strip().strip("\"'") for v in value[1:-1].split(",") if v.strip()]
        else:
            value = value.strip("\"'")
        meta[kv.group(1)] = value
    return meta


def items():
    for folder, kind in TYPE_DIRS.items():
        base = ROOT / folder
        if not base.is_dir():
            continue
        for item in sorted(p for p in base.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))):
            readme = item / "README.md"
            if not readme.is_file():
                continue
            meta = front_matter(readme.read_text(encoding="utf-8"))
            if meta and meta.get("title"):
                yield f"{folder}/{item.name}", kind, meta


def dump(data):
    out = json.dumps(data, ensure_ascii=False, indent=2)
    # short string lists stay on one line, as in the hand-written file
    out = re.sub(
        r'\[\n\s+("[^"\n]*"(?:,\n\s+"[^"\n]*")*)\n\s+\]',
        lambda m: "[" + re.sub(r",\n\s+", ", ", m.group(1)) + "]",
        out,
    )
    return out + "\n"


def main():
    check = "--check" in sys.argv
    path = ROOT / "topics" / "topics.json"
    original = path.read_text(encoding="utf-8")
    data = json.loads(original)
    topics = data.setdefault("topics", [])
    changes = []
    for folder, kind, meta in items():
        prefix = f"./{folder}"
        entry = next(
            (t for t in topics if any(r.get("href", "").rstrip("/").startswith(prefix) for r in t.get("resources", []))),
            None,
        )
        wanted = {k: meta[k] for k in FIELDS if k in meta}
        wanted.setdefault("type", kind)
        if wanted["type"] != kind:
            changes.append(f"{folder}: front matter type '{wanted['type']}' does not match the folder ({kind})")
            wanted["type"] = kind
        for key in LIST_FIELDS:
            if key in wanted and not isinstance(wanted[key], list):
                wanted[key] = [wanted[key]]
        readme_res = {"label": "README", "href": f"./{folder}/README.md", "available": True}
        if entry is None:
            resources = []
            if meta.get("open"):
                href = f"./{folder}/" + str(meta["open"]).replace("./", "", 1).lstrip("/")
                resources.append({"label": meta.get("open_label", "Open"), "href": href, "available": True})
            resources.append(readme_res)
            new = {k: wanted[k] for k in FIELDS if k in wanted}
            new["resources"] = resources
            topics.insert(0, new)
            changes.append(f"{folder}: added a hub card")
            continue
        for key, value in wanted.items():
            if entry.get(key) != value:
                entry[key] = value
                changes.append(f"{folder}: updated '{key}'")
        if not any(r.get("href", "").endswith(f"{folder}/README.md") for r in entry.get("resources", [])):
            entry.setdefault("resources", []).append(readme_res)
            changes.append(f"{folder}: added the README link")
    new_text = dump(data)
    if check:
        if new_text != original or changes:
            print("topics/topics.json is out of line with the item READMEs:")
            for c in changes or ["formatting differs"]:
                print("  -", c)
            print("Run: python3 scripts/sync_topics.py")
            sys.exit(1)
        print("topics.json is in line with the READMEs")
        return
    if new_text != original:
        path.write_text(new_text, encoding="utf-8")
    for c in changes:
        print("  -", c)
    print("topics.json updated" if new_text != original else "nothing to change")


if __name__ == "__main__":
    main()
