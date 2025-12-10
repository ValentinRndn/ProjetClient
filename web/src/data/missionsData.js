/**
 * Données des missions disponibles sur le Mur des Missions
 * Format: tableau d'objets mission avec tous les champs requis
 */

export const missionsData = [
  {
    id: 'MISS-001',
    title: 'Garder narjesse',
    school: 'INSEEC',
    status: 'open',
    description: 'elle mord',
    tags: ['IA', 'data'],
    hourlyRate: 1000,
    volume: 20,
    totalAmount: 20000,
    datePosted: '2025-11-20',
    location: 'Paris',
    duration: '3 semaines',
    level: 'Expert'
  },
  {
    id: 'MISS-002',
    title: 'IA generativr',
    school: 'EEMI',
    status: 'open',
    description: 'cours ia`',
    tags: ['CHAT GPT'],
    hourlyRate: 69,
    volume: 40,
    totalAmount: 2760,
    datePosted: '2025-11-22',
    location: 'Lyon',
    duration: '2 mois',
    level: 'Intermédiaire'
  }
];

// Liste des écoles uniques pour le filtre
export const schools = ['Toutes les écoles', 'INSEEC', 'EEMI', 'ESSEC', 'HEC Paris', 'ESCP'];

// Tranches de taux horaire pour le filtre
export const rateRanges = [
  { label: 'Tous les taux', min: 0, max: Infinity },
  { label: '0 - 50€/h', min: 0, max: 50 },
  { label: '50 - 100€/h', min: 50, max: 100 },
  { label: '100 - 500€/h', min: 100, max: 500 },
  { label: '500€/h et +', min: 500, max: Infinity }
];
