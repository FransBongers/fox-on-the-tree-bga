class ActionTokenManager extends CardManager<FottActionToken> {
  constructor(public game: GameAlias) {
    super(game, {
      getId: (card) => card.id,
      setupDiv: (card, div) => this.setupDiv(card, div),
      setupFrontDiv: (card, div: HTMLElement) => this.setupFrontDiv(card, div),
      setupBackDiv: (card, div: HTMLElement) => this.setupBackDiv(card, div),
      isCardVisible: (card) => this.isCardVisible(card),
      animationManager: game.animationManager,
    });
  }

  clearInterface() {}

  setupDiv(card: FottActionToken, div: HTMLElement) {
    div.classList.add('fott-action-token-container');
  }

  setupFrontDiv(card: FottActionToken, div: HTMLElement) {
    div.classList.add('fott-action-token');
    div.dataset.type = card.type;
  }

  setupBackDiv(card: FottActionToken, div: HTMLElement) {
    div.classList.add('fott-action-token');
  }

  isCardVisible(card: FottActionToken) {
    return true;
  }
}
