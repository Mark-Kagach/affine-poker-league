export type Player = {
  id: string;
  name: string;
  portrait: string | null;
  accent: string;
  score: number;
  boughtChips: number;
  finalChips: number;
  gamesPlayed: number;
  previousRank: number;
  joinedAt?: string;
};

export type RankedPlayer = Player & {
  rank: number;
  rankDelta: number;
};
