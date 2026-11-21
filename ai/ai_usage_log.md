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
- **Human Review Status**: Pending review. Geometry and STL export were checked in Node.js
  against three.js 0.160.0 (184 × 184 × 18 mm, waves facing +z); the in-browser rendering has
  not yet been viewed.
- **Git Hash**: Filled in after committing
