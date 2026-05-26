// LA TRYBU — Seed data
// Updated: only 1 played pozo (24 May), next on 7 June 2026.

window.SEED_PLAYERS = [
  { id: 'p1',  nombre: 'Miguel Ángel', apellido: 'Díaz',           nivel: 3.2, pts: 200, color: '#E5252A', joined: '2026-01-12' },
  { id: 'p2',  nombre: 'Óscar',        apellido: 'López',          nivel: 3.1, pts: 200, color: '#1F8A5B', joined: '2026-01-12' },
  { id: 'p3',  nombre: 'Toni',         apellido: 'Onieva',         nivel: 2.9, pts: 150, color: '#2A6FDB', joined: '2026-01-18' },
  { id: 'p4',  nombre: 'Christian',    apellido: 'Lavado',         nivel: 2.9, pts: 150, color: '#9355C4', joined: '2026-01-18' },
  { id: 'p5',  nombre: 'Alejandro',    apellido: 'Benítez',        nivel: 2.7, pts: 120, color: '#D97757', joined: '2026-01-20' },
  { id: 'p6',  nombre: 'Sergio',       apellido: 'Benítez',        nivel: 2.7, pts: 120, color: '#0E0E0E', joined: '2026-01-20' },
  { id: 'p7',  nombre: 'Jorge',        apellido: 'Ramírez',        nivel: 2.5, pts: 100, color: '#E5252A', joined: '2026-02-02' },
  { id: 'p8',  nombre: 'David',        apellido: 'López',          nivel: 2.5, pts: 100, color: '#1F8A5B', joined: '2026-02-02' },
  { id: 'p9',  nombre: 'David',        apellido: 'Alcalá',         nivel: 2.3, pts: 80,  color: '#B81E22', joined: '2026-02-10' },
  { id: 'p10', nombre: 'Luis',         apellido: 'Díaz Jiménez',   nivel: 2.3, pts: 80,  color: '#2A6FDB', joined: '2026-02-10' },
  { id: 'p11', nombre: 'Leonel',       apellido: 'Dávila',         nivel: 2.1, pts: 60,  color: '#9355C4', joined: '2026-02-14' },
  { id: 'p12', nombre: 'Gonzalo',      apellido: 'Dávila',         nivel: 2.1, pts: 60,  color: '#D97757', joined: '2026-02-14' },
  { id: 'p13', nombre: 'Alberto',      apellido: 'Jiménez',        nivel: 2.0, pts: 40,  color: '#0E0E0E', joined: '2026-03-01' },
  { id: 'p14', nombre: 'Raúl',         apellido: 'Gallardo',       nivel: 2.0, pts: 40,  color: '#E5252A', joined: '2026-03-01' },
  { id: 'p15', nombre: 'Antonio',      apellido: 'Hervías Espín',  nivel: 1.8, pts: 25,  color: '#1F8A5B', joined: '2026-03-08' },
  { id: 'p16', nombre: 'Fernando',     apellido: 'Hervías Sevilla',nivel: 1.8, pts: 25,  color: '#2A6FDB', joined: '2026-03-08' },
  { id: 'p17', nombre: 'Aitor',        apellido: 'Villar',         nivel: 1.7, pts: 25,  color: '#9355C4', joined: '2026-03-15' },
  { id: 'p18', nombre: 'Javi',         apellido: 'Díez',           nivel: 1.7, pts: 25,  color: '#D97757', joined: '2026-03-15' },
  { id: 'p19', nombre: 'David',        apellido: 'Erazo',          nivel: 1.6, pts: 25,  color: '#B81E22', joined: '2026-04-01' },
  { id: 'p20', nombre: 'Álvaro',       apellido: 'Martín',         nivel: 1.6, pts: 25,  color: '#0E0E0E', joined: '2026-04-01' },
  { id: 'p21', nombre: 'Pablo',        apellido: 'Cano',           nivel: 1.5, pts: 10,  color: '#E5252A', joined: '2026-04-12' },
  { id: 'p22', nombre: 'Iván',         apellido: 'Mora',           nivel: 1.5, pts: 10,  color: '#1F8A5B', joined: '2026-04-12' },
  { id: 'p23', nombre: 'Rubén',        apellido: 'Sanz',           nivel: 1.4, pts: 10,  color: '#2A6FDB', joined: '2026-04-25' },
  { id: 'p24', nombre: 'Marcos',       apellido: 'Pérez',          nivel: 1.4, pts: 10,  color: '#9355C4', joined: '2026-04-25' },
  { id: 'p25', nombre: 'Daniel',       apellido: 'Vidal',          nivel: 1.3, pts: 0,   color: '#D97757', joined: '2026-05-10' },
  { id: 'p26', nombre: 'Hugo',         apellido: 'Castro',         nivel: 1.3, pts: 0,   color: '#0E0E0E', joined: '2026-05-10' },
  { id: 'p27', nombre: 'Marco',        apellido: 'Ríos',           nivel: 1.2, pts: 0,   color: '#B81E22', joined: '2026-05-20' },
  { id: 'p28', nombre: 'Adrián',       apellido: 'Soto',           nivel: 1.2, pts: 0,   color: '#1F8A5B', joined: '2026-05-20' },
];

// Fixed pairs — 14 pairs of 2 players (28 total)
window.SEED_PAIRS = [
  { id: 'pair-1',  name: 'Díaz / López',          playerIds: ['p1','p2']   },
  { id: 'pair-2',  name: 'Onieva / Lavado',       playerIds: ['p3','p4']   },
  { id: 'pair-3',  name: 'Hermanos Benítez',      playerIds: ['p5','p6']   },
  { id: 'pair-4',  name: 'Ramírez / López',       playerIds: ['p7','p8']   },
  { id: 'pair-5',  name: 'Alcalá / Díaz J.',      playerIds: ['p9','p10']  },
  { id: 'pair-6',  name: 'Hermanos Dávila',       playerIds: ['p11','p12'] },
  { id: 'pair-7',  name: 'Jiménez / Gallardo',    playerIds: ['p13','p14'] },
  { id: 'pair-8',  name: 'Hermanos Hervías',      playerIds: ['p15','p16'] },
  { id: 'pair-9',  name: 'Villar / Díez',         playerIds: ['p17','p18'] },
  { id: 'pair-10', name: 'Erazo / Álvaro',        playerIds: ['p19','p20'] },
  { id: 'pair-11', name: 'Cano / Mora',           playerIds: ['p21','p22'] },
  { id: 'pair-12', name: 'Sanz / Pérez',          playerIds: ['p23','p24'] },
  { id: 'pair-13', name: 'Vidal / Castro',        playerIds: ['p25','p26'] },
  { id: 'pair-14', name: 'Ríos / Soto',           playerIds: ['p27','p28'] },
];

// Points per court — 1st (Pista Reina) = 200, then 160, 80, 60, 40, 25, 10
window.COURT_POINTS = [200, 160, 80, 60, 40, 25, 10];
window.COURT_NAMES  = ['Pista Reina', 'Pista 2', 'Pista 3', 'Pista 4', 'Pista 5', 'Pista 6', 'Pista 7'];

function buildAssignment(pairIds) {
  const a = {};
  for (let i = 0; i < 7; i++) {
    a[i] = [pairIds[i*2], pairIds[i*2+1]];
  }
  return a;
}
const emptyAssignment = () => {
  const a = {}; for (let i = 0; i < 7; i++) a[i] = [null, null]; return a;
};

window.SEED_POZOS = [
  // ONE completed pozo
  {
    id: 'pz-1',
    name: 'Pozo Inaugural',
    date: '2026-05-09',
    type: 'ranking',
    status: 'completed',
    fee: 10,
    capacity: 28,
    registered: ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15','p16','p17','p18','p19','p20','p21','p22','p23','p24','p25','p26','p27','p28'],
    waitlist: [],
    payments: Object.fromEntries(Array.from({length:28},(_,i)=>['p'+(i+1),'paid'])),
    assignment: buildAssignment([
      'pair-1','pair-3','pair-2','pair-4','pair-5','pair-7',
      'pair-6','pair-8','pair-9','pair-10','pair-11','pair-12',
      'pair-13','pair-14'
    ]),
    results: { 0:'pair-1', 1:'pair-2', 2:'pair-5', 3:'pair-6', 4:'pair-9', 5:'pair-11', 6:'pair-13' },
    announcements: [
      { id:'a1', from:'Admin', date:'2026-05-08', text:'¡Mañana arrancamos! Recordad llegar 15 min antes para calentar.' },
      { id:'a2', from:'Admin', date:'2026-05-10', text:'Gracias a todos por venir. ¡Brutal el ambiente! Próximo pozo el 7 de junio.' },
    ],
  },
  // NEXT pozo — 7 June 2026 (the upcoming one)
  {
    id: 'pz-next',
    name: 'Pozo Junio',
    date: '2026-06-07',
    type: 'ranking',
    status: 'upcoming',
    fee: 10,
    capacity: 28,
    registered: ['p1','p2','p3','p4','p5','p6','p9','p10','p11','p12','p13','p14','p15','p16','p17','p18'],
    waitlist: ['p21','p22'],
    payments: { p1:'paid', p2:'paid', p3:'paid', p4:'paid', p5:'paid', p6:'paid', p9:'pending', p10:'pending', p11:'paid', p12:'paid', p13:'paid', p14:'paid', p15:'pending', p16:'pending', p17:'paid', p18:'paid' },
    assignment: emptyAssignment(),
    results: {},
    announcements: [
      { id:'a3', from:'Admin', date:'2026-05-26', text:'Inscripción abierta para el Pozo de Junio. Plazas limitadas a 28.' },
    ],
  },
];

// Club configuration (editable by admin)
window.SEED_CLUB_CONFIG = {
  defaultFee: 10,
  defaultCapacity: 28,
  membershipFee: 25,
  welcomePack: [
    { id: 'w1', n: '01', t: 'Camiseta oficial', d: 'Tejido técnico La Trybu' },
    { id: 'w2', n: '02', t: 'Llavero + muñequera', d: 'Set con sticker de pala' },
    { id: 'w3', n: '03', t: 'Pack 3 bolas',       d: 'Para tu primer pozo' },
  ],
  signupFields: [
    { id: 'nombre',    label: 'Nombre',       required: true,  type: 'text', enabled: true },
    { id: 'apellido',  label: 'Apellido',     required: true,  type: 'text', enabled: true },
    { id: 'email',     label: 'Email',        required: true,  type: 'email', enabled: true },
    { id: 'telefono',  label: 'Teléfono',     required: false, type: 'tel', enabled: true },
    { id: 'nivel',     label: 'Nivel (0–5)',  required: false, type: 'number', enabled: true },
    { id: 'companyero',label: 'Compañero/a fijo', required: false, type: 'text', enabled: true },
    // Talla camiseta off by default — admin can re-enable
    { id: 'talla',     label: 'Talla camiseta', required: false, type: 'select', options:['S','M','L','XL','XXL'], enabled: false },
  ],
};

// The current logged-in player (for self-view)
window.CURRENT_USER_ID = 'p1';
