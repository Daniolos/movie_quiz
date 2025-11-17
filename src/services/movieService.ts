import axios from 'axios';
import { Movie } from '@/types/movie.types';

const RAPIDAPI_BASE_URL = 'https://imdb232.p.rapidapi.com/api';

interface IMDbAutocompleteResult {
  d: Array<{
    i?: {
      imageUrl: string;
    };
    id: string;
    l: string; // title
    q?: string; // type (e.g., "feature")
    rank?: number;
    s?: string; // stars/cast
    y?: number; // year
  }>;
}

interface IMDbKeyword {
  keyword: string;
}

// Cache structure in localStorage
interface MovieCache {
  [movieId: string]: {
    movie: Movie;
    timestamp: number;
    keywords: string[];
  };
}

class MovieService {
  private apiKey: string = '';
  private cacheKey = 'movie-quiz-cache';
  private cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private getHeaders() {
    return {
      'X-Rapidapi-Key': this.apiKey,
      'X-Rapidapi-Host': 'imdb232.p.rapidapi.com',
    };
  }

  // Cache management
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
        timestamp: Date.now(),
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  private getFromCache(movieId: string): { movie: Movie; keywords: string[] } | null {
    const cache = this.getCache();
    const cached = cache[movieId];

    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      return null;
    }

    return {
      movie: cached.movie,
      keywords: cached.keywords,
    };
  }

  clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async searchMovies(query: string): Promise<Array<{ id: string; title: string; year?: number }>> {
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
        }));
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  }

  async getMovieKeywords(movieId: string): Promise<string[]> {
    try {
      const response = await axios.get<IMDbKeyword[]>(
        `${RAPIDAPI_BASE_URL}/title/get-keywords`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId },
        }
      );

      // Filter out keywords with hyphens
      return response.data
        .map((kw) => kw.keyword)
        .filter((keyword) => !keyword.includes('-'))
        .slice(0, 20); // Limit to 20
    } catch (error) {
      console.error('Error fetching keywords:', error);
      return [];
    }
  }

  async getMovieDetails(movieId: string): Promise<Movie> {
    // Check cache first
    const cached = this.getFromCache(movieId);
    if (cached) {
      console.log('Using cached movie data for', movieId);
      return cached.movie;
    }

    try {
      // Fetch keywords in parallel with movie search
      const [keywords, searchResults] = await Promise.all([
        this.getMovieKeywords(movieId),
        this.searchMovies(movieId), // Get basic info from autocomplete
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
        description: 'Plot description coming soon...', // IMDb API doesn't provide plot in free tier
        keywords: keywords,
        genres: [],
        posterUrl: '',
        rating: 0,
        imdbId: movieId,
      };

      // Cache the result
      this.saveToCache(movieId, movie, keywords);

      return movie;
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw new Error('Failed to get movie details');
    }
  }

  async getRandomMovie(): Promise<Movie> {
    // List of popular movie IDs from various franchises
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
