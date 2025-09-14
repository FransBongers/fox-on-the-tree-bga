/* ------- DEFAULT LOG TOKENS ------- */

const tlpLogTokenText = ({
  text,
  tooltipId,
  italic = false,
}: {
  text: string;
  tooltipId?: string;
  italic?: boolean;
}) =>
  `<span ${
    tooltipId ? `id="${tooltipId}" class="log_tooltip"` : ''
  } style="font-weight: 700;${italic ? ' font-style: italic;' : ''}">${_(
    text
  )}</span>`;

const tplLogTokenPlayerName = ({
  name,
  color,
}: {
  name: string;
  color: string;
}) => `<span class="playername" style="color:#${color};">${name}</span>`;

/* ------- GAME SPECIFIC LOG TOKENS ------- */

const tplLogTokenAnimal = (animal: string) =>
  `<div class="log-token fott-animal" data-animal="${animal}" data-phase="1"></div>`;

const tplLogTokenActionToken = (type: string) =>
  `<div class="log-token fott-action-token" data-type="${type}"></div>`;

const tplLogTokenTile = (tile: string) =>
  `<div class="log-token fott-tile" data-tile-id="${tile}"></div>`;

const tplLogTokenCard = (cardId: string) =>
  `<div class="log-token fott-card" data-card-id="${cardId}"></div>`;
