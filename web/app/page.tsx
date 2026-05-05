import { AutoplayInit } from "./components/AutoplayInit";
import { BootScreen } from "./components/BootScreen";
import { CornerSuits, GridFloor } from "./components/Ornaments";
import { Leaderboard } from "./components/Leaderboard";
import { SoundToggle } from "./components/SoundToggle";
import { rankPlayers } from "./lib/rank";
import type { Player } from "./lib/types";
import playersData from "./data/players.json";

export default function Home() {
  const players = rankPlayers(playersData as Player[]);

  return (
    <main>
      <AutoplayInit />
      <GridFloor />
      <CornerSuits />
      <BootScreen />
      <Leaderboard players={players} />
      <SoundToggle />
    </main>
  );
}
