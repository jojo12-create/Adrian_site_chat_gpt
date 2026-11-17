import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { ZONES3D } from '../../content/anatomie-3d.mjs';
import { troubles } from '../../content/categories.mjs';

const bytes = readFileSync(new URL('../../site/public/anatomie-3d/model.bin', import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'), '9abdf4d1670e0cd6c774d0a5df81231a8067fdc8c0cf191f8215e785109010cf', 'Le modèle de référence doit rester identique');
const size = bytes.readUInt32LE(0), base = 4 + size;
const head = JSON.parse(bytes.subarray(4, base).toString('utf8'));
const layers = new Set(['skeleton', 'ligaments', 'muscles', 'nerves', 'viscera', 'skin']);
let vertices = 0, triangles = 0;
for (const m of head.meshes) {
  assert(layers.has(m.layer));
  assert(m.v > 0 && m.v <= 65535 && m.i % 3 === 0);
  for (const [offset, length] of [[m.p, m.v * 6], [m.g, m.v], [m.a, m.v * 4], [m.x, m.i * 2]]) {
    assert(offset >= 0 && base + offset + length <= bytes.length, 'Données hors du fichier');
  }
  let index = 0;
  for (let i = 0; i < m.i; i++) {
    index = (index + bytes.readUInt16LE(base + m.x + i * 2)) & 65535;
    assert(index < m.v, 'Index de triangle hors du maillage');
  }
  for (let i = 0; i < m.v; i++) assert(head.groups[bytes[base + m.g + i]], 'Groupe absent');
  vertices += m.v; triangles += m.i / 3;
}
assert.deepEqual(Object.keys(ZONES3D).sort(), troubles.map((t) => t.slug).sort());
for (const z of Object.values(ZONES3D)) for (const step of z.steps || [z]) {
  for (const g of [...Object.keys(step.g), ...(step.focus || [])]) assert(head.groups[g], `Groupe ${g} absent`);
  for (const joint of step.joints || []) for (const side of ['left', 'right']) assert(head.joints[`${joint}_${side}`]);
  if (step.cam) assert(head.joints[step.cam]);
}
console.log(`Modèle identique : ${bytes.length} octets, gzip ${gzipSync(bytes).length}, ${head.meshes.length} maillages, ${vertices} sommets, ${triangles} triangles ; 7 motifs valides.`);
