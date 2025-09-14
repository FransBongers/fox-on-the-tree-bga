class AnimalManager extends CardManager<FottAnimal> {
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

  setupDiv(card: FottAnimal, div: HTMLElement) {
    div.classList.add('fott-animal-container');
  }

  setupFrontDiv(card: FottAnimal, div: HTMLElement) {
    div.classList.add('fott-animal');
    div.dataset.facing = 'right';
    div.dataset.animal = card.id;
    div.dataset.type = card.type;
  }

  setupBackDiv(card: FottAnimal, div: HTMLElement) {
    div.classList.add('fott-animal');

    div.dataset.animal = card.id;
    div.dataset.type = card.type;
  }

  isCardVisible(card: FottAnimal) {
    return card.facing === 'right';
  }
}
