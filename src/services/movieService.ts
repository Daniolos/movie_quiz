import axios from 'axios';
import { Movie, TMDbMovie, TMDbMovieDetails, TMDbKeywordsResponse } from '@/types/movie.types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

class MovieService {
  private apiKey: string = '';

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getPopularMovies(page: number = 1): Promise<TMDbMovie[]> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        headers: this.getHeaders(),
        params: { page },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to fetch popular movies');
    }
  }

  async getMovieDetails(movieId: number): Promise<TMDbMovieDetails> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  async getMovieKeywords(movieId: number): Promise<string[]> {
    try {
      const response = await axios.get<TMDbKeywordsResponse>(
        `${TMDB_BASE_URL}/movie/${movieId}/keywords`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.keywords
        .map((kw) => kw.name)
        .filter((name) => !name.includes('-')); // Filter out hyphenated keywords
    } catch (error) {
      console.error('Error fetching movie keywords:', error);
      return [];
    }
  }

  async searchMovies(query: string): Promise<TMDbMovie[]> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        headers: this.getHeaders(),
        params: { query },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  }

  async getRandomMovie(genreIds?: number[]): Promise<Movie> {
    try {
      // Get random page between 1-10
      const randomPage = Math.floor(Math.random() * 10) + 1;

      const params: any = { page: randomPage };
      if (genreIds && genreIds.length > 0) {
        params.with_genres = genreIds.join(',');
      }

      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        headers: this.getHeaders(),
        params,
      });

      const movies = response.data.results;
      if (!movies || movies.length === 0) {
        throw new Error('No movies found');
      }

      // Select random movie from the page
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];

      // Get detailed info
      const [details, keywords] = await Promise.all([
        this.getMovieDetails(randomMovie.id),
        this.getMovieKeywords(randomMovie.id),
      ]);

      return this.mapToMovie(details, keywords);
    } catch (error) {
      console.error('Error getting random movie:', error);
      throw new Error('Failed to get random movie');
    }
  }

  private mapToMovie(details: TMDbMovieDetails, keywords: string[]): Movie {
    return {
      id: details.id.toString(),
      title: details.title,
      year: new Date(details.release_date).getFullYear(),
      description: details.overview,
      keywords: keywords.slice(0, 20), // Limit to 20 keywords
      genres: details.genres.map((g) => g.name),
      posterUrl: details.poster_path
        ? `${TMDB_IMAGE_BASE}/w500${details.poster_path}`
        : '',
      backdropUrl: details.backdrop_path
        ? `${TMDB_IMAGE_BASE}/original${details.backdrop_path}`
        : undefined,
      rating: Math.round(details.vote_average * 10) / 10,
      imdbId: details.imdb_id,
      voteCount: details.vote_count,
      runtime: details.runtime,
      releaseDate: details.release_date,
    };
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      this.setApiKey(key);
      await axios.get(`${TMDB_BASE_URL}/configuration`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  getImageUrl(path: string, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  }
}

export const movieService = new MovieService();
