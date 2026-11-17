import { troubles } from './categories.mjs';
import { site } from './site.mjs';
import { esc } from './layout.mjs';

/* Visualiseur : même balisage sur la page dédiée et dans les sections de l'accueil et du hub.
   embedded : image différée et démarrage au clic (« Explorer en 3D »), pour ne rien charger au défilement. */
export const anatomieApp = ({ embedded = false } = {}) => `<div class="anatomie-app" data-anatomie${embedded ? ' data-anatomie-embedded' : ''}>
  <script type="application/json" data-anatomie-content>${JSON.stringify({ rdv: site.links.doctolib, troubles: troubles.map(({ slug, label, h1, short, lead }) => ({ slug, label, h1, short, lead })) }).replace(/</g, '\\u003c')}</script>
<div class="stage" id="stage">
    <img class="poster" id="poster" src="/anatomie-3d/poster.webp" ${embedded ? 'loading="lazy"' : 'loading="eager" fetchpriority="high"'} decoding="async" alt="" width="842" height="1052">
    <p class="loading" id="loading" role="status">Vue anatomique</p>
    ${embedded ? '<button type="button" class="anatomie-load" data-anatomie-load hidden>Explorer en 3D</button>\n    ' : ''}<div class="tools">
      <div class="seg" role="group" aria-label="Couches affichées">
        <button type="button" id="l-sk" aria-pressed="true">Squelette</button>
        <button type="button" id="l-mu" aria-pressed="false">Muscles</button>
        <button type="button" id="l-ne" aria-pressed="false">Nerfs</button>
        <button type="button" id="l-vi" aria-pressed="false">Viscères</button>
      </div>
      <button type="button" class="reset" id="reset">Réinitialiser la vue</button>
    </div>
    <div class="chooser" id="chooser" role="dialog" aria-label="Plusieurs motifs pour cette zone"></div>
    <p class="credit">Modèle anatomique : <a href="https://www.z-anatomy.com/">Z-Anatomy</a>, d’après BodyParts3D © DBCLS, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, adapté. Zones illustratives, pas une carte diagnostique.</p>
  </div>

  <section class="drawer" id="drawer" aria-label="Motifs de consultation">
    <button type="button" class="handle" id="handle" aria-expanded="false" aria-controls="drawer-body">
      <span><strong>Motifs de consultation</strong><br><span id="handle-sub">Choisissez une zone</span></span>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 12l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="body" id="drawer-body">
      <ul class="legend" id="legend">${troubles.map((t) => `<li><a href="/osteopathie/${t.slug}/">${esc(t.label)}</a></li>`).join('')}</ul>
      <div class="panel" id="panel" aria-live="polite">
        <p class="hint">Sélectionnez un motif dans la liste, ou touchez une zone du corps. Faites glisser pour tourner, pincez ou utilisez la molette pour zoomer.</p>
      </div>
    </div>
  </section>
</div>`;

export const anatomieSection = () => `
<section class="anatomie-sec" id="anatomie" aria-labelledby="anatomie-t">
  <div class="wrap anatomie-sec-head">
    <h2 id="anatomie-t" data-reveal>Le corps, <em>zone par zone</em></h2>
    <p class="lead" data-reveal>Faites tourner le modèle et choisissez un motif de consultation pour voir les structures concernées.</p>
  </div>
  ${anatomieApp({ embedded: true })}
</section>`;
export const anatomieAssets = { styles: ['/src/styles/anatomie-3d.css'], scripts: ['/src/scripts/anatomie-3d/load.js'] };

export const anatomiePage = {
  id: 'anatomie-3d', path: '/anatomie-3d/', file: 'anatomie-3d/index.html', noindex: true,
  title: 'Anatomie 3D | Adrian Rodriguez, ostéopathe',
  description: 'Explorez les structures anatomiques et les motifs de consultation du cabinet d’ostéopathie d’Adrian Rodriguez à Villefontaine.',
  styles: ['/src/styles/anatomie-3d.css'], scripts: ['/src/scripts/anatomie-3d/load.js'],
  body: `<div class="anatomie-heading wrap"><h1>Anatomie 3D</h1></div>
${anatomieApp()}
`,
};
