"""Make a Braille-ready file (BRF) of the activity guide, in contracted UEB (Grade 2).

Translation is done by liblouis (table en-ueb-g2.ctb) through its Python bindings, with the
North American BRF character set (en-us-brf.dis). Layout is simple and consistent: 40 cells per
line, 25 lines per page, a form feed between pages, headings centered with a blank line before
them, paragraphs starting in cell 3, and list items starting in cell 1 with runover lines in
cell 3. It is not a certified transcription; have a qualified transcriber review it before
formal use.

Requires the liblouis Python bindings (Debian/Ubuntu package python3-louis), which are installed
for the system Python, so run it with that interpreter:

    /usr/bin/python3 make_brf.py

Reads activity-guide.md and writes activity-guide.brf next to this script.
"""

import re
from pathlib import Path

import louis

TABLES = ["en-us-brf.dis", "en-ueb-g2.ctb"]
WIDTH, LINES = 40, 25
HERE = Path(__file__).parent


def plain(text):
    """Strip Markdown emphasis and links, keeping the words."""
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    return text.strip()


def braille(text):
    return louis.translateString(TABLES, plain(text))


def wrap(cells, first_indent, runover_indent):
    """Wrap a translated string on spaces, never splitting a braille word."""
    # A word too long for one line (a web address) may break after a slash, "_/" in BRF.
    tokens = []
    for w in cells.split(" "):
        if len(w) > WIDTH - runover_indent:
            parts = re.split(r"(?<=_/)", w)
            tokens.append((parts[0], " "))
            tokens.extend((p, "") for p in parts[1:])
        else:
            tokens.append((w, " "))
    lines, line = [], " " * first_indent
    for w, joiner in tokens:
        sep = "" if line.strip() == "" else joiner
        if len(line) + len(sep) + len(w) <= WIDTH:
            line += sep + w
        else:
            lines.append(line.rstrip())
            line = " " * runover_indent + w
    lines.append(line.rstrip())
    return lines


def blocks(md):
    """Yield (kind, text) blocks: title, heading, para, item, rule."""
    body = md.split("---", 2)[2] if md.startswith("---") else md
    meta = re.search(r'title:\s*"([^"]+)"', md)
    sub = re.search(r'subtitle:\s*"([^"]+)"', md)
    if meta:
        yield "title", meta.group(1)
    if sub:
        yield "para", sub.group(1)
    para = []
    for raw in body.splitlines() + [""]:
        line = raw.rstrip()
        item = re.match(r"^\s*(?:-|\d+\.)\s+(.*)", line)
        heading = re.match(r"^#{1,6}\s+(.*)", line)
        bold_head = re.match(r"^\*\*([^*]+)\*\*$", line.strip())
        if heading or bold_head or item or line.strip() in ("", "---"):
            if para:
                yield para[0], " ".join(para[1:])
                para = []
        if heading:
            yield "heading", heading.group(1)
        elif bold_head:
            yield "heading", bold_head.group(1)
        elif item:
            number = re.match(r"^\s*(\d+)\.", line)
            prefix = f"{number.group(1)}. " if number else ""
            para = ["item", prefix + item.group(1)]
        elif line.strip() == "---":
            yield "rule", ""
        elif line.strip():
            if not para:
                para = ["para"]
            para.append(line.strip())


def main():
    md = (HERE / "activity-guide.md").read_text(encoding="utf-8")
    out = []
    for kind, text in blocks(md):
        if kind in ("title", "heading"):
            if out:
                out.append("")
            for ln in wrap(braille(text), 0, 0):
                out.append(ln.center(WIDTH).rstrip())
        elif kind == "para":
            out.extend(wrap(braille(text), 2, 0))
        elif kind == "item":
            out.extend(wrap(braille(text), 0, 2))
        elif kind == "rule":
            out.append("")
            out.append("7" * WIDTH)  # dots 2-3-5-6 across the line, a common transcriber's divider

    pages = [out[i:i + LINES] for i in range(0, len(out), LINES)]
    text = "\f".join("\r\n".join(p) + "\r\n" for p in pages)
    (HERE / "activity-guide.brf").write_bytes(text.encode("ascii"))
    longest = max(len(l) for l in out)
    print(f"wrote activity-guide.brf: {len(pages)} pages, {len(out)} lines, longest line {longest} cells")


if __name__ == "__main__":
    main()
