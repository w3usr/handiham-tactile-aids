# Handiham Tactile Aids

Prototype tactile learning aids for teaching the US Technician Class amateur radio license to
blind and visually impaired students, in support of the Courage Kenny Handiham Program. A
project of the University of Scranton Amateur Radio Club (W3USR).

Project lead: Nathaniel A. Frissell, W2NAF.

## Wave Grid 3×3

**Interactive 3D viewer:** <https://w3usr.github.io/handiham-tactile-aids/>

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
against, the left and back rim strips carry Braille labels, and a raised dot marks the front-left
corner for orientation.

The viewer's sliders change the frequencies and amplitudes, and **Export STL** writes a
print-ready file in millimeters, oriented with the waves facing up. At the default settings the
board is 184 × 184 mm and 18 mm tall.

This is a first prototype, not yet printed or tested with students.

## License

Licensed under the [Creative Commons Attribution 4.0 International License](LICENSE)
(CC BY 4.0). You may reuse and adapt this material, including commercially, with credit to the
University of Scranton Amateur Radio Club (W3USR).

## AI assistance

This repository contains AI-assisted work. The tool, the date, and the scope of each AI-assisted
session are recorded in [`ai/ai_usage_log.md`](ai/ai_usage_log.md). A human club member reviews
the work and is accountable for it.
