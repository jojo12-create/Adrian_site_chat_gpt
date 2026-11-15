// POST /api/contact : demande de rappel envoyée depuis /contact.
// Enregistre la demande en base (rien n'est perdu), puis prévient le cabinet par e-mail.
import { db, email } from 'hatchable';

export const methods = ['POST'];
export const access = 'public';

// Destinataire de la notification. Sur l'offre gratuite Hatchable, l'envoi n'aboutit
// que vers une adresse autorisée (propriétaire du projet, collaborateurs) : la
// demande reste de toute façon enregistrée dans la table contact_requests.
const NOTIFY_TO = 'adrian.osteo38@gmail.com';
const ALLOWED_FOR = ['Un adulte', 'Un enfant ou un adolescent', 'Un nourrisson', 'Une femme enceinte', 'Un sportif', 'Une personne âgée', 'Autre'];

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function (req, res) {
  const b = req.body || {};

  // Pot de miel anti-robots : on répond « OK » sans rien enregistrer.
  if (clean(b.website, 200)) return res.json({ ok: true });

  const name = clean(b.name, 100);
  const contact = clean(b.contact, 120);
  const forWho = clean(b.for, 60);
  const message = clean(b.message, 1000);

  // Validation serveur (messages identiques à ceux du navigateur).
  if (name.length < 2) return res.status(400).json({ field: 'name', error: 'Indiquez votre nom et prénom.' });
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact);
  const isPhone = /^(\+33|0033|0)[1-9]\d{8}$/.test(contact.replace(/[\s.\-()]/g, ''));
  if (!isEmail && !isPhone) return res.status(400).json({ field: 'contact', error: 'Ce numéro ou cet e-mail ne semble pas valide.' });
  if (!ALLOWED_FOR.includes(forWho)) return res.status(400).json({ field: 'for', error: 'Choisissez la personne concernée par la séance.' });
  if (b.consent !== true) return res.status(400).json({ field: 'consent', error: 'Cochez la case pour que je puisse vous recontacter.' });

  const { rows } = await db.query(
    'INSERT INTO contact_requests (name, contact, for_who, message) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, contact, forWho, message || null]
  );

  // Notification : un échec d'e-mail ne fait pas échouer la demande (déjà enregistrée).
  let notified = false;
  try {
    await email.send({
      to: NOTIFY_TO,
      subject: `Demande de rappel : ${name}`,
      text: `Nouvelle demande depuis le site.\n\nNom : ${name}\nContact : ${contact}\nSéance pour : ${forWho}\nMessage : ${message || '(aucun)'}\n`,
      html: `<p>Nouvelle demande depuis le site.</p><ul><li><strong>Nom :</strong> ${escapeHtml(name)}</li><li><strong>Contact :</strong> ${escapeHtml(contact)}</li><li><strong>Séance pour :</strong> ${escapeHtml(forWho)}</li><li><strong>Message :</strong> ${escapeHtml(message || '(aucun)')}</li></ul>`,
    });
    notified = true;
  } catch (err) {
    console.log('Notification e-mail non envoyée :', String(err && err.message || err));
  }
  if (notified) await db.query('UPDATE contact_requests SET notified = true WHERE id = $1', [rows[0].id]);

  res.json({ ok: true });
}
