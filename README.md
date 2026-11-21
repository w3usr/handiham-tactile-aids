# Handiham Tactile Aids

Prototype tactile learning aids for teaching the US Technician Class amateur radio license to
blind and visually impaired students, in support of the Courage Kenny Handiham Program. A
project of the University of Scranton Amateur Radio Club (W3USR).

Project lead: Nathaniel A. Frissell, W2NAF.

## Wave Grid 3×3

**Interactive 3D viewer:** <https://w3usr.github.io/handiham-tactile-aids/>

**Design brief:** <https://w3usr.github.io/handiham-tactile-aids/brief.html>

A 3D-printable demonstration board of nine 2-inch square tiles, each carrying a sine wave a
student traces by touch:

- **Columns** are frequency, low to high from left to right (1, 2, and 4 cycles per tile by
  default).
- **Rows** are amplitude, high to low from back to front (6, 3, and 1.5 mm peak by default).
- **The x axis is time**, as on an oscilloscope trace, so the number of cycles in a tile is its
  frequency. The wave is extruded 2 inches along the other axis to give the fingers room to feel
  it, and its height is the signal amplitude.

Every tile starts at the same phase, so the tiles differ only in frequency and amplitude. Grooves
separate the tiles, a rim at the zero level gives a flat reference to feel crests and troughs
against, and a raised dot marks the front-left corner for orientation.

**Labels** are printed into the rim as raised text with Unified English Braille (UEB) Grade 1
beneath: "frequency" and each column's cycle count on the back strip, "amplitude" and each row's
height on the left strip, and "time" with a raised arrow on the front strip. The Braille dots
are 1.6 mm domed hemispheres, 2.4 mm apart within a cell and 6.2 mm cell to cell, inside the
ranges of the US Access Board's
[ADA guide to signs](https://www.access-board.gov/ada/guides/chapter-7-signs/) (section 703.3).
The Braille word forms come from [liblouis](https://liblouis.io/) (`en-ueb-g1.ctb`), and every
label the viewer can produce was checked against it. The raised print uses Droid Sans Bold
(Apache License 2.0), loaded from the three.js examples.

The viewer's sliders change the frequencies and amplitudes, and **Export STL** writes a
print-ready file in millimeters, oriented with the waves facing up. At the default settings the
labeled board is 230 × 226 mm and 18 mm tall, so it needs a print bed of at least 231 × 227 mm.
Turning the labels off returns the compact 184 × 184 mm board.

The board geometry lives in [`board.js`](board.js), shared by the viewer and the brief.

This is a first prototype, not yet printed or tested with students.

## Teaching materials

In [`worksheets/`](worksheets/), rebuilt from source by `worksheets/build.sh`:

- **Activity guide** for a teacher guiding a student who is blind or has low vision through the
  board, ending with questions that promote thinking and check understanding. Written once in
  Markdown ([`activity-guide.md`](worksheets/activity-guide.md)) and produced as a
  [web page](https://w3usr.github.io/handiham-tactile-aids/worksheets/activity-guide.html), a
  PDF, and a Braille-ready file (BRF) in contracted UEB (Grade 2) made with liblouis. The BRF
  layout is simple (40 cells, 25 lines per page) and is not a certified transcription.
- **Write-in worksheet** for sighted students, with actual-size drawings of the nine tile profiles
  from `make_profiles.py`. The core pages suit K–12 outreach; a "Going further" page covers period,
  wavelength, and power for an introductory physics or engineering course. The student copy and
  the answer key build from the same LaTeX source.

## License

Licensed under the [Creative Commons Attribution 4.0 International License](LICENSE)
(CC BY 4.0). You may reuse and adapt this material, including commercially, with credit to the
University of Scranton Amateur Radio Club (W3USR).

## AI assistance

This repository contains AI-assisted work. The tool, the date, and the scope of each AI-assisted
session are recorded in [`ai/ai_usage_log.md`](ai/ai_usage_log.md). A human club member reviews
the work and is accountable for it.
