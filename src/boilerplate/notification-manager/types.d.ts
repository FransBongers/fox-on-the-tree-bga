/**
 * Note: we need to keep player_name in snake case, because the framework uses
 * it to add player colors to the log messages.
 */

interface Log {
  log: string;
  args: Record<string, unknown>;
}

interface NotifWithPlayerArgs {
  playerId: number;
  player_name: string;
}

interface NotifDiscardActionToken extends NotifWithPlayerArgs {
  actionToken: FottActionToken;
}

interface NotifMoveAnimal extends NotifWithPlayerArgs {
  animal: FottAnimal;
  tileId: string;
}

interface NotifPhase {
  phase: string | number;
}


interface NotifPlaceActionToken extends NotifWithPlayerArgs {
  actionToken: FottActionToken;
  tileId: string;
}

interface NotifScorePoints {
  animal: FottAnimal;
  animalToken: FottAnimalToken | null;
  phase: 1 | 2;
}