-- Demandes de rappel envoyées par le formulaire /contact.
-- Conservation : 12 mois maximum (voir /confidentialite), purge à prévoir.
CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  for_who TEXT NOT NULL,
  message TEXT,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
