"""Draw the nine Wave Grid tile profiles at actual size for the write-in worksheet.

Each panel is the side view of one tile: the same sine wave the board carries, drawn 1:1 so
that a student can count cycles and measure the amplitude with a millimeter ruler. Values match
the board's defaults in ../board.js (2-inch tiles; 1, 2, 4 cycles; 6, 3, 1.5 mm peak). Panels
carry letters only, so the student works out which property changes.

Usage: python make_profiles.py  ->  writes profiles.pdf next to this script.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

MM = 1 / 25.4                     # inches per millimeter
TILE = 50.8                       # tile length, mm (2 in)
CYCLES = [1, 2, 4]                # columns, left to right
AMPS = [6.0, 3.0, 1.5]            # rows, top to bottom, peak in mm
LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
HALF = 7.5                        # panel half-height, mm
GAP_X, GAP_Y = 9.0, 9.0           # space between panels, mm
LEFT, BOTTOM, TOP = 6.0, 9.0, 2.0  # outer margins, mm

panel_w, panel_h = TILE, 2 * HALF
fig_w = LEFT + 3 * panel_w + 2 * GAP_X + 2.0
fig_h = BOTTOM + 3 * panel_h + 2 * GAP_Y + TOP

fig = plt.figure(figsize=(fig_w * MM, fig_h * MM))
x = np.linspace(0, TILE, 600)

for r, amp in enumerate(AMPS):
    for c, cyc in enumerate(CYCLES):
        x0 = LEFT + c * (panel_w + GAP_X)
        y0 = BOTTOM + (2 - r) * (panel_h + GAP_Y)
        ax = fig.add_axes([x0 / fig_w, y0 / fig_h, panel_w / fig_w, panel_h / fig_h])
        ax.set_xlim(0, TILE)
        ax.set_ylim(-HALF, HALF)
        # 1 mm grid for measuring, light enough to print in grayscale
        for g in np.arange(-7, 8):
            ax.axhline(g, color="0.85" if g % 5 else "0.65", lw=0.3, zorder=0)
        ax.axhline(0, color="0.35", lw=0.6, zorder=1)
        ax.plot(x, amp * np.sin(2 * np.pi * cyc * x / TILE), color="black", lw=1.1, zorder=2)
        ax.set_xticks([])
        ax.set_yticks([])
        for s in ax.spines.values():
            s.set_linewidth(0.6)
        ax.text(-1.5, HALF - 0.5, LETTERS[3 * r + c], ha="right", va="top", fontsize=10, fontweight="bold")

fig.text((LEFT + 1.5 * panel_w + GAP_X) / fig_w, 2.5 / fig_h,
         "time  →        (each box is one tile, 50.8 mm wide; grid lines are 1 mm apart)",
         ha="center", va="bottom", fontsize=7.5)

out = Path(__file__).with_name("profiles.pdf")
fig.savefig(out)
print(f"wrote {out} ({fig_w:.1f} x {fig_h:.1f} mm)")
