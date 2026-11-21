// Wave Grid 3x3: shared board geometry for the viewer (index.html) and the brief (brief.html).
//
// Units are millimeters. Board coordinates: x = time (left to right as the student faces the
// board), z = depth (back to front, toward the student), y = height.
//
// Labels are raised English text plus Unified English Braille (UEB) Grade 1, the project's
// labeling convention. Braille dot geometry sits inside the ranges of the US Access Board's
// ADA guide to Chapter 7 (signs), section 703.3: dot base diameter 1.5-1.6 mm, dot height
// 0.64-0.94 mm, dots in a cell 2.29-2.54 mm apart, adjacent cells 6.12-7.62 mm apart, all
// center to center, domed. ADA governs only the dot geometry here; the board is a teaching
// aid, not a building sign.

import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const IN = 25.4;
export const FONT_URL = 'https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json';

export const DEFAULTS = { cycles: [1, 2, 4], amps: [6, 3, 1.5], frame: true, labels: true };

const L = 2 * IN;      // tile length along the time axis
const W = 2 * IN;      // tile depth, extruded to give the fingers room
const GAP = 4;         // groove between tiles
const PLATE = 3;       // base plate thickness
const FLOOR = 3;       // minimum solid under the deepest trough
const N = 240;         // samples along each sinusoid

// Braille dot geometry (see header): hemispheres, so base diameter = 2 x height.
export const BR = { dotDia: 1.6, dotH: 0.8, inCell: 2.4, cellPitch: 6.2 };

// Label block: one line of raised print above one line of Braille.
const TEXT_SIZE = 7;                              // font size; capitals stand about 5 mm tall
const TEXT_H = 5.2;                               // depth the print line occupies
const TEXT_RAISE = 0.8;                           // height of the raised print
const BR_H = 2 * BR.inCell + BR.dotDia;           // depth of one Braille line
const BLOCK = TEXT_H + 3 + BR_H;                  // print, gap, Braille
const PAD = 4;

// UEB Grade 1 for this board's label vocabulary. The word forms were produced by liblouis
// (table en-ueb-g1.ctb, liblouis 3.20.0); numbers use the numeric indicator, letters a-j for
// the digits 1-0, and dots 2-5-6 for the decimal point.
const WORDS = {
  frequency: '⠋⠗⠑⠟⠥⠑⠝⠉⠽',
  amplitude: '⠁⠍⠏⠇⠊⠞⠥⠙⠑',
  time: '⠞⠊⠍⠑',
  cycle: '⠉⠽⠉⠇⠑',
  cycles: '⠉⠽⠉⠇⠑⠎',
  mm: '⠍⠍',
};
const DIGITS = { '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊', '0': '⠚', '.': '⠲' };

export function braille(text) {
  return text.split(' ').map(w => {
    if (/^[0-9]+(\.[0-9]+)?$/.test(w)) return '⠼' + [...w].map(c => DIGITS[c]).join('');
    if (!(w in WORDS)) throw new Error(`No Braille form for "${w}"`);
    return WORDS[w];
  }).join('⠀');
}

export const cycleLabel = n => `${n} ${n === 1 ? 'cycle' : 'cycles'}`;
export const ampLabel = a => `${a} mm`;

// Margins: wide enough for horizontal labels when labels are on.
export function margins(labels) {
  return labels
    ? { left: 62, back: Math.ceil(PAD + BLOCK + 5 + BLOCK + PAD), front: Math.ceil(PAD + BLOCK + PAD), right: 8 }
    : { left: 16, back: 16, front: 8, right: 8 };
}

export function boardSize(p) {
  const m = margins(p.labels);
  const z0 = FLOOR + Math.max(...p.amps);
  return {
    width: m.left + 3 * L + 2 * GAP + m.right,
    depth: m.back + 3 * W + 2 * GAP + m.front,
    height: PLATE + z0 + Math.max(...p.amps),
    zeroLevel: PLATE + z0,
    margins: m,
  };
}

// A domed dot: hemisphere plus a base disk, so each dot is a closed solid.
function dotGeometry(radius, x, y, z) {
  const cap = new THREE.SphereGeometry(radius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const base = new THREE.CircleGeometry(radius, 16).rotateX(Math.PI / 2);
  return mergeGeometries([ni(cap), ni(base)]).translate(x, y, z);
}

function tileGeometry(z0, A, cycles) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  for (let i = 0; i <= N; i++) {
    const x = (L * i) / N;
    s.lineTo(x, z0 + A * Math.sin((2 * Math.PI * cycles * x) / L));
  }
  s.lineTo(L, 0);
  return new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: false, steps: 1 });
}

// Merging needs every part non-indexed; some three.js geometries already are.
const ni = g => (g.index ? g.toNonIndexed() : g);

function boxGeometry(w, h, d, x, y, z) {
  return new THREE.BoxGeometry(w, h, d).translate(x + w / 2, y + h / 2, z + d / 2);
}

// Returns { group, size, labels } where labels lists every label placed, for on-screen captions.
export function buildBoard(p, font, mats) {
  const size = boardSize(p);
  const m = size.margins;
  const z0 = size.zeroLevel - PLATE;
  const top = size.zeroLevel;
  const fieldW = 3 * L + 2 * GAP;
  const group = new THREE.Group();
  const placed = [];

  // Base plate and the frame rim at the zero level
  const frame = [boxGeometry(size.width, PLATE, size.depth, 0, 0, 0)];
  if (p.frame || p.labels) {  // labels need the rim to sit on
    frame.push(
      boxGeometry(m.left, z0, size.depth, 0, PLATE, 0),
      boxGeometry(size.width - m.left, z0, m.back, m.left, PLATE, 0),
      boxGeometry(m.right, z0, size.depth - m.back, size.width - m.right, PLATE, m.back),
      boxGeometry(size.width - m.left - m.right, z0, m.front, m.left, PLATE, size.depth - m.front),
    );
  }
  group.add(new THREE.Mesh(mergeGeometries(frame.map(ni)), mats.frame));

  // Tiles: column = frequency, row = amplitude (row 0 = back = highest)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const mesh = new THREE.Mesh(tileGeometry(z0, p.amps[r], p.cycles[c]), mats.rows ? mats.rows[r] : mats.tile);
      mesh.position.set(m.left + c * (L + GAP), PLATE, m.back + r * (W + GAP));
      group.add(mesh);
    }
  }

  // Orientation dot: front-left corner, larger than a Braille dot so it cannot be mistaken for one
  const hasRim = p.frame || p.labels;
  const corner = hasRim ? [dotGeometry(4, m.left / 2, top, size.depth - (p.labels ? m.front / 2 : m.front / 2 + 4))] : [];

  if (p.labels && font) {
    const print = [], dots = [];
    // One label: print line on top (farther from the student), Braille line below it.
    const label = (text, cx, zTop) => {
      const g = new TextGeometry(text, { font, size: TEXT_SIZE, height: TEXT_RAISE, curveSegments: 6 });
      g.computeBoundingBox();
      const bb = g.boundingBox;
      g.translate(-(bb.min.x + bb.max.x) / 2, 0, 0);
      g.rotateX(-Math.PI / 2);                       // lie flat; letter tops point to the back
      g.translate(cx, top, zTop + TEXT_H);
      print.push(ni(g));

      const cells = [...braille(text)];
      const span = (cells.length - 1) * BR.cellPitch + BR.inCell;
      const x0 = cx - span / 2;
      const zb = zTop + TEXT_H + 3 + BR.dotDia / 2;
      cells.forEach((ch, i) => {
        const bits = ch.codePointAt(0) - 0x2800;
        for (let d = 0; d < 6; d++) {
          if (!(bits & (1 << d))) continue;
          const col = d < 3 ? 0 : 1, row = d % 3;  // dots 1-3 left column, 4-6 right, top to bottom
          dots.push(dotGeometry(BR.dotDia / 2, x0 + i * BR.cellPitch + col * BR.inCell, top, zb + row * BR.inCell));
        }
      });
      placed.push({ text, braille: braille(text), x: cx, z: zTop + BLOCK / 2, y: top });
    };

    const fieldMid = m.left + fieldW / 2;
    const row1 = PAD, row2 = PAD + BLOCK + 5;
    label('frequency', fieldMid, row1);
    label('amplitude', m.left / 2, row1);  // heads the row-label column, clear of the column labels
    for (let c = 0; c < 3; c++) label(cycleLabel(p.cycles[c]), m.left + c * (L + GAP) + L / 2, row2);
    for (let r = 0; r < 3; r++) label(ampLabel(p.amps[r]), m.left / 2, m.back + r * (W + GAP) + W / 2 - BLOCK / 2);
    const zFront = size.depth - m.front + PAD;
    label('time', fieldMid - 22, zFront);

    // A raised arrow after "time", pointing the way time runs
    const arrow = new THREE.Shape();
    const ay = 0, ax = 0;
    arrow.moveTo(ax, ay - 1); arrow.lineTo(ax + 30, ay - 1); arrow.lineTo(ax + 30, ay - 4);
    arrow.lineTo(ax + 40, ay); arrow.lineTo(ax + 30, ay + 4); arrow.lineTo(ax + 30, ay + 1);
    arrow.lineTo(ax, ay + 1); arrow.lineTo(ax, ay - 1);
    const ag = new THREE.ExtrudeGeometry(arrow, { depth: TEXT_RAISE, bevelEnabled: false })
      .rotateX(-Math.PI / 2).translate(fieldMid + 2, top, zFront + BLOCK / 2);
    print.push(ni(ag));

    group.add(new THREE.Mesh(mergeGeometries(print), mats.print || mats.frame));
    group.add(new THREE.Mesh(mergeGeometries(dots), mats.print || mats.frame));
  }
  if (corner.length) group.add(new THREE.Mesh(mergeGeometries(corner), mats.print || mats.frame));

  return { group, size, labels: placed };
}
