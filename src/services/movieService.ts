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

// Plot API response
interface IMDbPlotResponse {
  data: {
    title: {
      id: string;
      plot?: {
        id: string;
        plotText: {
          plainText: string;
        };
      };
    };
  };
}

// Overview API response
interface IMDbOverviewResponse {
  data: {
    title: {
      id: string;
      titleText: {
        text: string;
      };
      releaseYear: {
        year: number;
      };
      runtime?: {
        seconds: number;
      };
      ratingsSummary?: {
        aggregateRating: number;
        voteCount: number;
      };
      genres?: {
        genres: Array<{
          text: string;
        }>;
      };
      plot?: {
        plotText: {
          plainText: string;
        };
      };
      primaryImage?: {
        url: string;
      };
      certificate?: {
        rating: string;
      };
    };
  };
}

// Quotes API response
interface IMDbQuotesResponse {
  data: {
    title: {
      id: string;
      quotes?: {
        edges: Array<{
          node: {
            id: string;
            lines: Array<{
              text: string;
              characters?: Array<{
                character: string;
              }>;
            }>;
          };
        }>;
      };
    };
  };
}

// Trivia API response
interface IMDbTriviaResponse {
  data: {
    title: {
      id: string;
      trivia?: {
        edges: Array<{
          node: {
            id: string;
            text: {
              plainText: string;
            };
            isSpoiler: boolean;
          };
        }>;
      };
    };
  };
}

// Details API response
interface IMDbDetailsResponse {
  data: {
    title: {
      __typename: string;
      id: string;
      titleText: {
        text: string;
        isOriginalTitle: boolean;
      };
      releaseYear: {
        __typename: string;
        year: number;
        endYear: number | null;
      };
      releaseDate?: {
        year: number;
        month: number;
        day: number;
      };
      primaryImage?: {
        url: string;
        height: number;
        width: number;
      };
      runtime?: {
        seconds: number;
      };
      genres?: {
        genres: Array<{
          id: string;
          text: string;
        }>;
      };
      ratingsSummary?: {
        aggregateRating: number;
        voteCount: number;
      };
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
      console.log('[MovieService] Searching for:', query);
      const response = await axios.get<IMDbAutocompleteResult>(
        `${RAPIDAPI_BASE_URL}/autocomplete`,
        {
          headers: this.getHeaders(),
          params: { q: query },
        }
      );

      console.log('[MovieService] Autocomplete API response:', response.data);

      const results = response.data.d
        .filter((item) => item.q === 'feature' || item.q === 'TV movie') // Only movies
        .map((item) => ({
          id: item.id || '',
          title: (item.l || '').trim(),
          year: item.y,
          imageUrl: item.i?.imageUrl,
        }))
        .filter((item) => item.id && item.title); // Only include items with valid ID and title

      console.log('[MovieService] Filtered results:', results);
      return results;
    } catch (error) {
      console.error('[MovieService] Error searching movies:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      throw new Error('Failed to search movies');
    }
  }

  async getMovieKeywords(movieId: string): Promise<string[]> {
    try {
      console.log('[MovieService] Fetching keywords for:', movieId);
      const response = await axios.get<IMDbKeywordsResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-keywords`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId },
        }
      );

      console.log('[MovieService] Keywords API response:', response.data);

      // Extract keywords from nested structure
      const allKeywords: string[] = [];

      if (response.data?.data?.title?.keywordItemCategories) {
        response.data.data.title.keywordItemCategories.forEach((category) => {
          if (category.keywords?.edges) {
            category.keywords.edges.forEach((edge) => {
              try {
                const keywordText = edge?.node?.keyword?.text?.text;

                // Validate keyword is a non-empty string
                if (keywordText && typeof keywordText === 'string' && keywordText.trim()) {
                  const cleaned = keywordText.trim();
                  // Filter out keywords with hyphens and those starting with "character says"
                  if (!cleaned.includes('-') && !cleaned.startsWith('character says')) {
                    allKeywords.push(cleaned);
                  }
                }
              } catch (err) {
                console.warn('[MovieService] Error extracting keyword from edge:', edge, err);
              }
            });
          }
        });
      } else {
        console.error('[MovieService] Unexpected API response structure:', response.data);
      }

      console.log('[MovieService] Extracted keywords:', allKeywords);

      // Limit to 20 keywords and shuffle
      const shuffled = allKeywords.sort(() => Math.random() - 0.5);
      const final = shuffled.slice(0, 20);

      console.log('[MovieService] Final keywords (shuffled, max 20):', final);
      return final;
    } catch (error) {
      console.error('[MovieService] Error fetching keywords:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      return [];
    }
  }

  async getMoviePlot(movieId: string): Promise<string> {
    try {
      console.log('[MovieService] Fetching plot for:', movieId);
      const response = await axios.get<IMDbPlotResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-plot`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId },
        }
      );

      console.log('[MovieService] Plot API response:', response.data);

      const plot = response.data?.data?.title?.plot?.plotText?.plainText;
      return plot?.trim() || 'Plot not available';
    } catch (error) {
      console.error('[MovieService] Error fetching plot:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      return 'Plot not available';
    }
  }

  async getMovieDetailsData(movieId: string): Promise<{
    runtime: number;
    genres: string[];
    rating: number;
    voteCount: number;
    imageUrl: string;
  }> {
    try {
      console.log('[MovieService] Fetching detailed data for:', movieId);
      const response = await axios.get<IMDbDetailsResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-details`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId },
        }
      );

      console.log('[MovieService] Details API response:', response.data);

      const title = response.data?.data?.title;

      const runtime = title?.runtime?.seconds ? Math.round(title.runtime.seconds / 60) : 0;
      const genres = title?.genres?.genres?.map((g) => g.text) || [];
      const rating = title?.ratingsSummary?.aggregateRating || 0;
      const voteCount = title?.ratingsSummary?.voteCount || 0;
      const imageUrl = title?.primaryImage?.url || '';

      return {
        runtime,
        genres,
        rating,
        voteCount,
        imageUrl,
      };
    } catch (error) {
      console.error('[MovieService] Error fetching details:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      return {
        runtime: 0,
        genres: [],
        rating: 0,
        voteCount: 0,
        imageUrl: '',
      };
    }
  }

  async getMovieDetails(movieId: string): Promise<Movie> {
    // Check cache first
    const cached = this.getFromCache(movieId);
    if (cached) {
      console.log('[MovieService] Using cached movie:', cached.movie.title);
      return cached.movie;
    }

    try {
      console.log('[MovieService] Fetching movie details for:', movieId);

      // Fetch all data in parallel
      const [keywords, searchResults, plot, details] = await Promise.all([
        this.getMovieKeywords(movieId),
        this.searchMovies(movieId), // Search by ID to get basic info and year
        this.getMoviePlot(movieId),
        this.getMovieDetailsData(movieId),
      ]);

      // Find the movie in search results for title and year
      const movieInfo = searchResults.find((m) => m.id === movieId);

      if (!movieInfo) {
        console.error('[MovieService] Movie not found in search results:', movieId);
        throw new Error('Movie not found');
      }

      console.log('[MovieService] Movie info:', movieInfo);

      const movie: Movie = {
        id: movieId,
        title: movieInfo.title.trim(),
        year: movieInfo.year || 0,
        description: plot,
        keywords: keywords,
        genres: details.genres,
        posterUrl: details.imageUrl || movieInfo.imageUrl || '',
        rating: details.rating,
        voteCount: details.voteCount,
        runtime: details.runtime,
        imdbId: movieId,
      };

      console.log('[MovieService] Created movie object:', movie);

      // Cache the result (no expiry)
      this.saveToCache(movieId, movie, keywords);

      return movie;
    } catch (error) {
      console.error('[MovieService] Error getting movie details:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      throw new Error('Failed to get movie details');
    }
  }

  async getMovieOverview(movieId: string): Promise<{
    title: string;
    year: number;
    runtime: number;
    rating: number;
    voteCount: number;
    genres: string[];
    plot: string;
    imageUrl: string;
    certificate: string;
  }> {
    try {
      console.log('[MovieService] Fetching overview for:', movieId);
      const response = await axios.get<IMDbOverviewResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-overview`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId },
        }
      );

      console.log('[MovieService] Overview API response:', response.data);

      const title = response.data?.data?.title;

      return {
        title: title?.titleText?.text || '',
        year: title?.releaseYear?.year || 0,
        runtime: title?.runtime?.seconds ? Math.round(title.runtime.seconds / 60) : 0,
        rating: title?.ratingsSummary?.aggregateRating || 0,
        voteCount: title?.ratingsSummary?.voteCount || 0,
        genres: title?.genres?.genres?.map((g) => g.text) || [],
        plot: title?.plot?.plotText?.plainText || '',
        imageUrl: title?.primaryImage?.url || '',
        certificate: title?.certificate?.rating || '',
      };
    } catch (error) {
      console.error('[MovieService] Error fetching overview:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      return {
        title: '',
        year: 0,
        runtime: 0,
        rating: 0,
        voteCount: 0,
        genres: [],
        plot: '',
        imageUrl: '',
        certificate: '',
      };
    }
  }

  async getMovieQuotes(movieId: string): Promise<Array<{ id: string; text: string; character: string }>> {
    try {
      console.log('[MovieService] Fetching quotes for:', movieId);
      const response = await axios.get<IMDbQuotesResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-quotes`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId, limit: 20 },
        }
      );

      console.log('[MovieService] Quotes API response:', response.data);

      const quotes: Array<{ id: string; text: string; character: string }> = [];

      if (response.data?.data?.title?.quotes?.edges) {
        response.data.data.title.quotes.edges.forEach((edge) => {
          edge.node.lines.forEach((line) => {
            const character = line.characters?.[0]?.character || 'Unknown';
            quotes.push({
              id: edge.node.id,
              text: line.text,
              character: character,
            });
          });
        });
      }

      console.log('[MovieService] Extracted quotes:', quotes);
      return quotes.slice(0, 10); // Limit to 10 quotes
    } catch (error) {
      console.error('[MovieService] Error fetching quotes:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      return [];
    }
  }

  async getMovieTrivia(movieId: string): Promise<Array<{ id: string; text: string }>> {
    try {
      console.log('[MovieService] Fetching trivia for:', movieId);
      const response = await axios.get<IMDbTriviaResponse>(
        `${RAPIDAPI_BASE_URL}/title/get-trivia`,
        {
          headers: this.getHeaders(),
          params: { tt: movieId, limit: 20 },
        }
      );

      console.log('[MovieService] Trivia API response:', response.data);

      const triviaList: Array<{ id: string; text: string }> = [];

      if (response.data?.data?.title?.trivia?.edges) {
        response.data.data.title.trivia.edges.forEach((edge) => {
          // Filter out spoilers
          if (!edge.node.isSpoiler) {
            triviaList.push({
              id: edge.node.id,
              text: edge.node.text.plainText,
            });
          }
        });
      }

      console.log('[MovieService] Extracted trivia:', triviaList);
      return triviaList.slice(0, 5); // Limit to 5 trivia items
    } catch (error) {
      console.error('[MovieService] Error fetching trivia:', error);
      if (axios.isAxiosError(error)) {
        console.error('[MovieService] API Error Details:', error.response?.data);
      }
      return [];
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
