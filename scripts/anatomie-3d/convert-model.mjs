import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const [input, output = 'site/public/anatomie-3d/model.bin'] = process.argv.slice(2);
if (!input) throw new Error('Usage : node scripts/anatomie-3d/convert-model.mjs model.json [model.bin]');
const { b64 } = JSON.parse(readFileSync(input, 'utf8'));
if (typeof b64 !== 'string') throw new Error('Champ b64 absent');
const bytes = Buffer.from(b64, 'base64');
const length = bytes.readUInt32LE(0);
const header = JSON.parse(bytes.subarray(4, 4 + length).toString('utf8'));
if (!header.meshes?.length || !header.groups || !header.joints) throw new Error('En-tête de modèle invalide');
writeFileSync(output, bytes);
console.log(`${output} : ${bytes.length} octets, SHA-256 ${createHash('sha256').update(bytes).digest('hex')}`);
