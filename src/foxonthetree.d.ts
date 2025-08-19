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
  staticData: {

  };
  // Game specific
 
}

interface FoxOnTheTreePlayerData extends BgaPlayer {

}

type GameAlias = FoxOnTheTree;
type GamedatasAlias = FoxOnTheTreeGamedatas;
type PlayerAlias = FottPlayer;
type PlayerDataAlias = FoxOnTheTreePlayerData;


