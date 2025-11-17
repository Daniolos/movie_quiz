// Curated movie list with TMDb IDs
export const CURATED_MOVIES = {
  // Disney/Pixar
  'Finding Nemo': 12,
  'The Incredibles': 9806,
  'Monsters, Inc.': 585,
  'The Lion King': 8587,
  'Frozen': 109445,
  'Frozen II': 330457,
  'Tangled': 38757,
  'Moana': 277834,
  'Encanto': 568124,

  // Marvel Cinematic Universe
  'Iron Man': 1726,
  'Iron Man 2': 10138,
  'Iron Man 3': 68721,
  'Thor': 10195,
  'Thor: The Dark World': 76338,
  'Thor: Ragnarok': 284053,
  'Captain America: The First Avenger': 1771,
  'Captain America: The Winter Soldier': 100402,
  'Captain America: Civil War': 271110,
  'Guardians of the Galaxy': 118340,
  'Guardians of the Galaxy Vol. 2': 283995,
  'Ant-Man': 102899,
  'Ant-Man and the Wasp': 363088,
  'Black Panther': 284054,
  'Doctor Strange': 284052,
  'Spider-Man: Homecoming': 315635,
  'Spider-Man: Far from Home': 429617,
  'Spider-Man: No Way Home': 634649,
  'Captain Marvel': 299537,
  'Shang-Chi and the Legend of the Ten Rings': 566525,
  'The Avengers': 24428,
  'Avengers: Age of Ultron': 99861,
  'Avengers: Infinity War': 299536,
  'Avengers: Endgame': 299534,

  // Star Wars
  'Star Wars: Episode I - The Phantom Menace': 1893,
  'Star Wars: Episode II - Attack of the Clones': 1894,
  'Star Wars: Episode III - Revenge of the Sith': 1895,
  'Star Wars: Episode IV - A New Hope': 11,
  'Star Wars: Episode V - The Empire Strikes Back': 1891,
  'Star Wars: Episode VI - Return of the Jedi': 1892,
  'Star Wars: Episode VII - The Force Awakens': 140607,
  'Star Wars: Episode VIII - The Last Jedi': 181808,
  'Star Wars: Episode IX - The Rise of Skywalker': 181812,

  // Harry Potter
  "Harry Potter and the Philosopher's Stone": 671,
  'Harry Potter and the Chamber of Secrets': 672,
  'Harry Potter and the Prisoner of Azkaban': 673,
  'Harry Potter and the Goblet of Fire': 674,
  'Harry Potter and the Order of the Phoenix': 675,
  'Harry Potter and the Half-Blood Prince': 767,
  'Harry Potter and the Deathly Hallows: Part 1': 12444,
  'Harry Potter and the Deathly Hallows: Part 2': 12445,

  // Lord of the Rings
  'The Lord of the Rings: The Fellowship of the Ring': 120,
  'The Lord of the Rings: The Two Towers': 121,
  'The Lord of the Rings: The Return of the King': 122,

  // Indiana Jones
  'Raiders of the Lost Ark': 85,
  'Indiana Jones and the Temple of Doom': 87,
  'Indiana Jones and the Last Crusade': 89,

  // Classic Action
  'The Terminator': 218,
  'Terminator 2: Judgment Day': 280,
  'The Mummy': 564,
  'The Mummy Returns': 564,
  'Independence Day': 602,
} as const;

export const GENRE_LIST = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export const APP_CONFIG = {
  name: 'Movie Quiz',
  version: '2.0.0',
  description: 'Interactive movie quiz with AI-generated images',
  defaultTypingSpeed: 80,
  defaultMaxKeywords: 10,
  maxHistoryEntries: 50,
  minGuessLength: 3,
} as const;
