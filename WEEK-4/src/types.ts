export type MovieSummary = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
};

export type MovieDetails = MovieSummary & {
  Rated?: string;
  Released?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Plot?: string;
  Runtime?: string;
  imdbRating?: string;
  Country?: string;
  Language?: string;
};
