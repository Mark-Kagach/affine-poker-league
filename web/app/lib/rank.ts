import type { Player, RankedPlayer } from "./types";

export function rankPlayers(players: Player[]): RankedPlayer[] {
  const sorted = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.gamesPlayed !== b.gamesPlayed) return a.gamesPlayed - b.gamesPlayed;
    if (a.boughtChips !== b.boughtChips) return a.boughtChips - b.boughtChips;
    return a.name.localeCompare(b.name);
  });

  return sorted.map((player, index) => {
    const rank = index + 1;
    return {
      ...player,
      rank,
      rankDelta: player.previousRank - rank,
    };
  });
}
