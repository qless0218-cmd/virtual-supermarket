export const categories = [
  { id: 'all', label: 'All products', emoji: '✳' },
  { id: 'produce', label: 'Fresh produce', emoji: '🥑' },
  { id: 'bakery', label: 'Bakery', emoji: '🥐' },
  { id: 'dairy', label: 'Dairy & eggs', emoji: '🥛' },
  { id: 'pantry', label: 'Pantry', emoji: '🫙' },
  { id: 'drinks', label: 'Drinks', emoji: '🧃' },
  { id: 'snacks', label: 'Snacks', emoji: '🍫' },
]

export const products = [
  { id: 'avocado', name: 'Hass avocados', detail: 'Ripe & ready · pack of 2', price: 89, category: 'produce', emoji: '🥑', color: '#568554', origin: 'Nilgiris, India', aisle: '01', popular: true },
  { id: 'tomatoes', name: 'Heirloom tomatoes', detail: 'Farm fresh · 500 g', price: 64, category: 'produce', emoji: '🍅', color: '#e5624b', origin: 'Pune, India', aisle: '01' },
  { id: 'berries', name: 'Blueberries', detail: 'Sweet & juicy · 125 g', price: 149, category: 'produce', emoji: '🫐', color: '#6979aa', origin: 'Ooty, India', aisle: '01' },
  { id: 'sourdough', name: 'Country sourdough', detail: 'Baked this morning · 450 g', price: 135, category: 'bakery', emoji: '🍞', color: '#c99559', origin: 'In-store bakery', aisle: '02', popular: true },
  { id: 'croissant', name: 'Butter croissants', detail: 'French-style · pack of 2', price: 95, category: 'bakery', emoji: '🥐', color: '#dbac68', origin: 'In-store bakery', aisle: '02' },
  { id: 'milk', name: 'Organic whole milk', detail: 'Grass-fed · 1 litre', price: 78, category: 'dairy', emoji: '🥛', color: '#90b6cb', origin: 'A2 Co-operative', aisle: '03', popular: true },
  { id: 'eggs', name: 'Free-range eggs', detail: 'Farm fresh · 6 pack', price: 92, category: 'dairy', emoji: '🥚', color: '#e5d6aa', origin: 'Happy Hens Farm', aisle: '03' },
  { id: 'yogurt', name: 'Greek yoghurt', detail: 'Creamy & cultured · 400 g', price: 120, category: 'dairy', emoji: '🍶', color: '#dce6cc', origin: 'Hillside Dairy', aisle: '03' },
  { id: 'olive-oil', name: 'Extra virgin olive oil', detail: 'Cold pressed · 500 ml', price: 399, category: 'pantry', emoji: '🫒', color: '#87904f', origin: 'Crete, Greece', aisle: '04' },
  { id: 'pasta', name: 'Bronze-cut rigatoni', detail: 'Slow dried · 500 g', price: 149, category: 'pantry', emoji: '🍝', color: '#d2ab69', origin: 'Gragnano, Italy', aisle: '04', popular: true },
  { id: 'coffee', name: 'Single-origin coffee', detail: 'Medium roast · 250 g', price: 289, category: 'pantry', emoji: '☕', color: '#8c5a3b', origin: 'Chikmagalur, India', aisle: '04' },
  { id: 'kombucha', name: 'Ginger kombucha', detail: 'Naturally sparkling · 330 ml', price: 110, category: 'drinks', emoji: '🍹', color: '#c68d50', origin: 'Brewed in Bengaluru', aisle: '05' },
  { id: 'chocolate', name: 'Dark chocolate 70%', detail: 'Single origin · 100 g', price: 160, category: 'snacks', emoji: '🍫', color: '#70483b', origin: 'Coorg cacao', aisle: '06' },
]

export const money = value => `₹${value.toLocaleString('en-IN')}`
