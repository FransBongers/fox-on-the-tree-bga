const tplPlayerPanelInfo = (playerId: number) => {
  return `
<div id="actionTokens_${playerId}" class="fott-player-action-tokens">

</div>
<div id="card_${playerId}" class="fott-player-card"></div>
`;
};

const tplCard = (cardId: string) => `<div class="fott-card" data-card-id="${cardId}"></div>`;