const LOG_TOKEN_BOLD_TEXT = 'boldText';
const LOG_TOKEN_BOLD_ITALIC_TEXT = 'boldItalicText';
const LOG_TOKEN_NEW_LINE = 'newLine';
const LOG_TOKEN_PLAYER_NAME = 'playerName';
// Game specific

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

    default:
      return value;
  }
};
