# AI Usage Log: Handiham Tactile Aids

A project of the University of Scranton Amateur Radio Club (W3USR).

This log records every substantive AI-assisted session in this repository, as required by the
University of Scranton AI Policy (September 2025) and the HamSCI Generative AI Use Agreement.
The design documents behind these prototypes live in the club's private `handiham-tech`
repository, which keeps its own log.

Entries are appended newest at the bottom.

## Entry format

```
## [YYYY-MM-DD HH:MM TZ]
- **Tool**: Claude (Anthropic), <exact-model-id>
- **Session Purpose**: What this session set out to do
- **Sections/Files Affected**: The specific files or documents touched
- **Nature of Contribution**: Draft / Edit / Analysis / Code generation / Research / Scaffolding
- **Human Review Status**: Reviewed and verified / Partially reviewed / Pending review
- **Git Hash**: Filled in after committing
```

Date and time come from the system clock via `date`, never from an estimate.

---

<!-- Append new entries below this line, newest at the bottom. -->

## [2026-11-21 19:10 UTC]
- **Tool**: Claude (Anthropic), claude-opus-5-5
- **Session Purpose**: Build an interactive 3D viewer for a 3D-printable 3×3 wave grid
  (columns = frequency, rows = amplitude, x axis = time) specified by N. A. Frissell (W2NAF),
  as a first buildable Week 2 tactile aid; create this public repository to host it on GitHub
  Pages.
- **Sections/Files Affected**: `index.html` (new: three.js viewer, geometry, STL export),
  `README.md`, `LICENSE` (official CC BY 4.0 legal code, downloaded unchanged from
  creativecommons.org), `ai/ai_usage_log.md` (new)
- **Nature of Contribution**: Code generation / Draft
- **Human Review Status**: Partially reviewed. Geometry and STL export were checked in Node.js
  against three.js 0.160.0 (184 × 184 × 18 mm, waves facing +z). N. A. Frissell viewed the live
  page on GitHub Pages on 2026-11-21 and approved its appearance.
- **Git Hash**: 7318e84 (PR #1)

## [2026-11-21 19:38 UTC]
- **Tool**: Claude (Anthropic), claude-opus-5-5
- **Session Purpose**: Publish the Wave Grid 3×3 design brief as a static page that can be shared
  without a login. The brief was first drafted in a claude.ai doc under N. A. Frissell's
  direction and reviewed there; this page carries the same text, with the builder's name left
  off for the public version, and embeds an interactive three.js model of the board.
- **Sections/Files Affected**: `brief.html` (new), `README.md` (link to the brief),
  `ai/ai_usage_log.md` (this entry; review status of the previous entry updated)
- **Nature of Contribution**: Draft / Code generation
- **Human Review Status**: Partially reviewed. The text was reviewed in the claude.ai doc; the
  static page has not yet been viewed in a browser.
- **Git Hash**: 710b09c (PR #2)

## [2026-11-21 20:19 UTC]
- **Tool**: Claude (Anthropic), claude-opus-5-5
- **Session Purpose**: Label the board's axes, columns, and rows in raised English print and UEB
  Grade 1 Braille, built into the print, following a review recommendation relayed by
  N. A. Frissell. Move the board geometry into one module shared by the viewer and the brief.
- **Sections/Files Affected**: `board.js` (new: geometry, labels, Braille), `index.html` (uses
  `board.js`; integer cycle sliders; print-bed size shown), `brief.html` (embedded model uses
  `board.js`; specs, steps, and open questions updated for the labels), `README.md`,
  `ai/ai_usage_log.md`
- **Nature of Contribution**: Code generation / Draft / Research (Braille dot dimensions from
  the US Access Board's ADA Chapter 7 guide; Braille translation with liblouis 3.20.0)
- **Human Review Status**: Pending review. Checked in Node.js against three.js 0.160.0: the
  default board builds at 230.4 × 226.4 × 18.0 mm; all 28 slider label strings and the three
  axis words match liblouis `en-ueb-g1.ctb` exactly; a top-view render of the exported STL shows
  print and Braille in place. Not yet viewed in a browser, and the printed Braille has not been
  read by a Braille reader.
- **Git Hash**: 2ac1765 (PR #3)

## [2026-11-21 20:32 UTC]
- **Tool**: Claude (Anthropic), claude-opus-5-5
- **Session Purpose**: Write the teaching materials that go with the board, following a review
  recommendation relayed by N. A. Frissell: an activity guide for a teacher guiding a blind
  student, with closing questions, and a write-in worksheet for sighted students (K–12 core plus
  an introductory physics and engineering extension).
- **Sections/Files Affected**: `worksheets/` (new: `activity-guide.md` and its HTML, PDF, and BRF
  outputs; `write-in-worksheet.tex` with student and answer-key PDFs; `make_profiles.py` and
  `profiles.pdf`; `make_brf.py`; `build.sh`; `guide-style.html`), `brief.html` (links to the
  materials), `README.md`, `.gitignore` (new), `ai/ai_usage_log.md` (this entry; PR #3 recorded
  for the previous entry)
- **Nature of Contribution**: Draft / Code generation
- **Human Review Status**: Pending review. Checked: the full build runs without errors; the
  student worksheet is 3 pages and the key 5; the profile figure prints at 178.4 mm wide, 1:1
  with the board's tiles; every BRF line is at most 40 cells, and sample lines back-translate to
  the source text with liblouis. Not yet read by a teacher, and the BRF has not been read by a
  Braille reader or reviewed by a transcriber.
- **Git Hash**: 0362358 (PR pending)
