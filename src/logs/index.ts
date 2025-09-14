const LOG_TOKEN_BOLD_TEXT = 'boldText';
const LOG_TOKEN_BOLD_ITALIC_TEXT = 'boldItalicText';
const LOG_TOKEN_NEW_LINE = 'newLine';
const LOG_TOKEN_PLAYER_NAME = 'playerName';
// Game specific
const LOG_TOKEN_ANIMAL = 'animal';
const LOG_TOKEN_ACTION_TOKEN = 'actionToken';
const LOG_TOKEN_TILE = 'tile';
const LOG_TOKEN_CARD = 'card';

const CLASS_LOG_TOKEN = 'log-token';

let tooltipIdCounter = 0;

const getTokenDiv = ({
  key,
  value,
  game,
}: {
  key: string;
  value: string;
  game: GameAlias;
}) => {
  const splitKey = key.split('_');
  const type = splitKey[1];
  switch (type) {
    // Generic
    case LOG_TOKEN_BOLD_TEXT:
      return tlpLogTokenText({ text: value });
    case LOG_TOKEN_BOLD_ITALIC_TEXT:
      return tlpLogTokenText({ text: value, italic: true });
    case LOG_TOKEN_PLAYER_NAME:
      const player = PlayerManager.getInstance()
        .getPlayers()
        .find((player) => player.getName() === value);
      return player
        ? tplLogTokenPlayerName({
            name: player.getName(),
            color: player.getColor(),
          })
        : value;
          // Game specific
    case LOG_TOKEN_ANIMAL:
      return tplLogTokenAnimal(value);
    case LOG_TOKEN_ACTION_TOKEN:
      return tplLogTokenActionToken(value);
    case LOG_TOKEN_CARD:
      return tplLogTokenCard(value);
    case LOG_TOKEN_TILE:
      return tplLogTokenTile(value);
    default:
      return value;
  }
};
