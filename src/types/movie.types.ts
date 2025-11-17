export interface Movie {
  id: string;
  title: string;
  year: number;
  description: string;
  keywords: string[];
  genres: string[];
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  imdbId?: string;
  voteCount?: number;
  runtime?: number;
  releaseDate?: string;
}

export interface MovieKeyword {
  id: number;
  name: string;
}

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
}

export interface TMDbMovieDetails extends TMDbMovie {
  runtime: number;
  imdb_id: string;
  genres: { id: number; name: string }[];
  tagline: string;
  budget: number;
  revenue: number;
}

export interface TMDbKeywordsResponse {
  id: number;
  keywords: MovieKeyword[];
}
