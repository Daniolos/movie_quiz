import axios from 'axios';
import { Movie } from '@/types/movie.types';

const RAPIDAPI_BASE_URL = 'https://imdb232.p.rapidapi.com/api';

// Autocomplete API response
interface IMDbAutocompleteResult {
  d: Array<{
    i?: {
      height: number;
      imageUrl: string;
      width: number;
    };
    id: string;
    l: string; // title
    q?: string; // type (e.g., "feature", "TV series")
    qid?: string;
    rank?: number;
    s?: string; // stars/cast
    y?: number; // year
    yr?: string; // year range for series
  }>;
  q: string;
  v: number;
}

// Keywords API response (complex nested structure)
interface IMDbKeywordsResponse {
  data: {
    title: {
      id: string;
      titleType: {
        id: string;
      };
      keywordItemCategories: Array<{
        itemCategory: {
          id: string;
          itemCategoryId: string;
          text: string;
        };
        keywords: {
          __typename: string;
          total: number;
          edges: Array<{
            node: {
              keyword: {
                id: string;
                text: {
                  text: string;
                };
                category: {
                  id: string;
                } | null;
              };
            };
          }>;
        };
      }>;
    };
  };
}

// Cache structure in localStorage
interface MovieCache {
  [movieId: string]: {
    movie: Movie;
    keywords: string[];
  };
}

class MovieService {
  private apiKey: string = '';
  private cacheKey = 'movie-quiz-cache';

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private getHeaders() {
    return {
      'X-Rapidapi-Key': this.apiKey,
      'X-Rapidapi-Host': 'imdb232.p.rapidapi.com',
    };
  }

  // Cache management (no expiry - user controls when to clear)
  private getCache(): MovieCache {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('Error reading cache:', error);
      return {};
    }
  }

  private saveToCache(movieId: string, movie: Movie, keywords: string[]): void {
    try {
      const cache = this.getCache();
      cache[movieId] = {
        movie,
        keywords,
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
      console.log(`Cached movie: ${movie.title} (${movieId})`);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  private getFromCache(movieId: string): { movie: Movie; keywords: string[] } | null {
    const cache = this.getCache();
    const cached = cache[movieId];

    if (!cached) return null;

    console.log(`Using cached data for: ${cached.movie.title}`);
    return cached;
  }

  getCacheStats(): { totalMovies: number; totalSizeKB: number } {
    const cache = this.getCache();
    const totalMovies = Object.keys(cache).length;
    const cacheString = JSON.stringify(cache);
    const totalSizeKB = Math.round((cacheString.length * 2) / 1024); // UTF-16 = 2 bytes per char

    return { totalMovies, totalSizeKB };
  }

  clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async searchMovies(query: string): Promise<Array<{ id: string; title: string; year?: number; imageUrl?: string }>> {
    try {
      const response = await axios.get<IMDbAutocompleteResult>(
        `${RAPIDAPI_BASE_URL}/autocomplete`,
        {
          headers: this.getHeaders(),
          params: { q: query },
        }
      );

      return response.data.d
        .filter((item) => item.q === 'feature' || item.q === 'TV movie') // Only movies
        .map((item) => ({
          id: item.id,
          title: item.l,
          year: item.y,
          imageUrl: item.i?.imageUrl,
        }));
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  }

  async getMovieKeywords(movieId: string): Promise<string[]> {
    try {
      const response = await axios.get<IMDbKeywordsResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-keywords`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId },
        }
      );

      // Extract keywords from nested structure
      const allKeywords: string[] = [];

      if (response.data?.data?.title?.keywordItemCategories) {
        response.data.data.title.keywordItemCategories.forEach((category) => {
          if (category.keywords?.edges) {
            category.keywords.edges.forEach((edge) => {
              const keywordText = edge.node.keyword.text.text;
              // Filter out keywords with hyphens and those starting with "character says"
              if (!keywordText.includes('-') && !keywordText.startsWith('character says')) {
                allKeywords.push(keywordText);
              }
            });
          }
        });
      }

      // Limit to 20 keywords and shuffle
      const shuffled = allKeywords.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 20);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      return [];
    }
  }

  async getMovieDetails(movieId: string): Promise<Movie> {
    // Check cache first
    const cached = this.getFromCache(movieId);
    if (cached) {
      return cached.movie;
    }

    try {
      // Fetch keywords and basic info in parallel
      const [keywords, searchResults] = await Promise.all([
        this.getMovieKeywords(movieId),
        this.searchMovies(movieId), // Search by ID to get basic info
      ]);

      // Find the movie in search results
      const movieInfo = searchResults.find((m) => m.id === movieId);

      if (!movieInfo) {
        throw new Error('Movie not found');
      }

      const movie: Movie = {
        id: movieId,
        title: movieInfo.title,
        year: movieInfo.year || 0,
        description: 'Description not available from this API endpoint', // IMDb API doesn't provide plot in these endpoints
        keywords: keywords,
        genres: [], // Not available in these endpoints
        posterUrl: movieInfo.imageUrl || '',
        rating: 0, // Not available in these endpoints
        imdbId: movieId,
      };

      // Cache the result (no expiry)
      this.saveToCache(movieId, movie, keywords);

      return movie;
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw new Error('Failed to get movie details');
    }
  }

  async getRandomMovie(): Promise<Movie> {
    // List of popular movie IDs from IMDb top-rated
    const popularMovieIds = [
      'tt0111161', // The Shawshank Redemption
      'tt0068646', // The Godfather
      'tt0468569', // The Dark Knight
      'tt0108052', // Schindler's List
      'tt0167260', // The Lord of the Rings: The Return of the King
      'tt0110912', // Pulp Fiction
      'tt0109830', // Forrest Gump
      'tt0137523', // Fight Club
      'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
      'tt0167261', // The Lord of the Rings: The Two Towers
      'tt0080684', // Star Wars: Episode V - The Empire Strikes Back
      'tt0133093', // The Matrix
      'tt0099685', // Goodfellas
      'tt0073486', // One Flew Over the Cuckoo\'s Nest
      'tt0047478', // Seven Samurai
      'tt0114369', // Se7en
      'tt0317248', // City of God
      'tt0076759', // Star Wars: Episode IV - A New Hope
      'tt0102926', // The Silence of the Lambs
      'tt0118799', // Life Is Beautiful
      'tt0120815', // Saving Private Ryan
      'tt0816692', // Interstellar
      'tt0054215', // Psycho
      'tt0120689', // The Green Mile
      'tt0110413', // Léon: The Professional
      'tt0103064', // Terminator 2: Judgment Day
      'tt0088763', // Back to the Future
      'tt0407887', // The Departed
      'tt0482571', // The Prestige
      'tt0034583', // Casablanca
      'tt0095327', // Grave of the Fireflies
      'tt0245429', // Spirited Away
      'tt1375666', // Inception
      'tt0078788', // Apocalypse Now
      'tt0114814', // The Usual Suspects
      'tt0172495', // Gladiator
      'tt0110357', // The Lion King
      'tt0095765', // Cinema Paradiso
      'tt0816711', // District 9
      'tt0064116', // Once Upon a Time in the West
      'tt0027977', // Modern Times
      'tt0253474', // The Pianist
      'tt0078748', // Alien
      'tt0910970', // WALL·E
      'tt0050825', // Paths of Glory
      'tt0209144', // Memento
      'tt0090605', // Aliens
      'tt0211915', // Amélie
      'tt0405094', // The Lives of Others
      'tt1675434', // The Intouchables
      'tt0338013', // Eternal Sunshine of the Spotless Mind
      'tt0087843', // Once Upon a Time in America
      'tt0082971', // Raiders of the Lost Ark
      'tt0082096', // Das Boot
      'tt20215968', // Hit Man (2023)
    ];

    // Pick random movie ID
    const randomId = popularMovieIds[Math.floor(Math.random() * popularMovieIds.length)];

    return this.getMovieDetails(randomId);
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      this.setApiKey(key);
      await this.searchMovies('test');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const movieService = new MovieService();
