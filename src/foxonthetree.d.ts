// TODO: split in framework & game specicf

interface AddButtonProps {
  id: string;
  text: string;
  callback: () => void;
  extraClasses?: string;
}

interface AddActionButtonProps extends AddButtonProps {
  color?: 'blue' | 'gray' | 'red' | 'none';
}

interface State {
  onEnteringState: (args: any) => void;
  onLeavingState: () => void;
}

interface CommonStateArgs {
  optionalAction: boolean;
  previousEngineChoices: number;
  previousSteps: number[];
}

interface GamePiece {
  id: string;
  location: string;
  state: number;
}

interface FoxOnTheTreeGamedatas extends Gamedatas {
  // Default
  canceledNotifIds: string[];
  gameOptions: {};
  playerOrder: number[];
  players: Record<number, FoxOnTheTreePlayerData>;
  staticData: {};
  // Game specific
  actionTokens: Record<string, FottActionToken>;
  animals: Record<string, FottAnimal>;
  animalTokens: Record<string, FottAnimalToken>;
  phase: 1 | 2;
}

interface FottAnimal extends GamePiece {
  type: 'FarmAnimal' | 'Predator';
  facing: 'left' | 'right';
}

interface FottAnimalToken extends GamePiece {}

type ActionTokenType = 'Banana' | 'Escape' | 'Swamp';

interface FottActionToken extends GamePiece {
  type: ActionTokenType;
}

interface FottCard extends GamePiece {
  favored: Array<
    'Pig' | 'Cow' | 'Chicken' | 'Goat' | 'Wolf' | 'Fox' | 'Tiger' | 'Bear'
  >;
  unfavored:
    | 'Pig'
    | 'Cow'
    | 'Chicken'
    | 'Goat'
    | 'Wolf'
    | 'Fox'
    | 'Tiger'
    | 'Bear';
}

interface FoxOnTheTreePlayerData extends BgaPlayer {
  card: FottCard | null;
}

type GameAlias = FoxOnTheTree;
type GamedatasAlias = FoxOnTheTreeGamedatas;
type PlayerAlias = FottPlayer;
type PlayerDataAlias = FoxOnTheTreePlayerData;
