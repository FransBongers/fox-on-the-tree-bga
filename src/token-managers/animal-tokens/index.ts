class AnimalTokenManager extends CardManager<FottAnimalToken> {
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

  setupDiv(card: FottAnimalToken, div: HTMLElement) {
    div.classList.add('fott-animal-token-container');
  }

  setupFrontDiv(card: FottAnimalToken, div: HTMLElement) {
    div.classList.add('fott-animal-token');
    div.dataset.animal = card.id.split('_')[0]; 
  }

  setupBackDiv(card: FottAnimalToken, div: HTMLElement) {
    div.classList.add('fott-animal-token');
  }

  isCardVisible(card: FottAnimalToken) {
    return true;
  }
}
