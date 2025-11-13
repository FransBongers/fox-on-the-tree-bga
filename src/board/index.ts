const ZOOM_LEVELS = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5];
const LOCAL_STORAGE_ZOOM_KEY = 'FoxOnTheTree-zoom';

class Board {
  private static instance: Board;
  private game: GameAlias;

  public ui: {
    containers: {
      board: HTMLElement;
      selectBoxes: HTMLElement;
      tiles: Record<string, HTMLElement>;
      // setAsideStandees: HTMLElement;
    };
    animals: Record<string, HTMLElement>;
    selectBoxes: Record<string, HTMLElement>;
  };
  public actionTokenStocks: Record<string, LineStock<FottActionToken>> = {};
  public animalStocks: Record<string, FottManualPositionStock<FottAnimal>> = {};
  // public setAsideStandees: LineStock<FottAnimal>;

  constructor(game: GameAlias) {
    this.game = game;
    this.setup(game.gamedatas);
  }

  public static create(game: GameAlias) {
    Board.instance = new Board(game);
  }

  public static getInstance() {
    return Board.instance;
  }

  // .##.....##.##....##.########...#######.
  // .##.....##.###...##.##.....##.##.....##
  // .##.....##.####..##.##.....##.##.....##
  // .##.....##.##.##.##.##.....##.##.....##
  // .##.....##.##..####.##.....##.##.....##
  // .##.....##.##...###.##.....##.##.....##
  // ..#######..##....##.########...#######.

  public clearInterface() {}

  public async updateInterface(gamedatas: GamedatasAlias) {
    await Promise.all([
      this.updateAnimalsAsync(gamedatas),
      this.updateActionTokensAsync(gamedatas),
    ]);
  }

  // ..######..########.########.##.....##.########.
  // .##....##.##..........##....##.....##.##.....##
  // .##.......##..........##....##.....##.##.....##
  // ..######..######......##....##.....##.########.
  // .......##.##..........##....##.....##.##.......
  // .##....##.##..........##....##.....##.##.......
  // ..######..########....##.....#######..##.......

  // Setup functions
  setup(gamedatas: GamedatasAlias) {
    document
      .getElementById('play-area-container')
      .insertAdjacentHTML('beforeend', tplBoard(gamedatas));

    this.ui = {
      containers: {
        board: document.getElementById('fott-board'),
        selectBoxes: document.getElementById('fott-select-boxes'),
        tiles: {},
        // setAsideStandees: document.getElementById('fott-set-aside-standees'),
      },
      animals: {},
      selectBoxes: {},
    };
    this.setupTiles();
    // this.setupSetAsideStandees();

    this.setupAnimals(gamedatas);
    this.setupActionTokens(gamedatas);
    this.setupZoomControls();
  }

  private setupTiles() {
    TILES.forEach((tileId) => {
      this.ui.containers.tiles[tileId] = document.getElementById(tileId);
      const actionTokenSlot = document.createElement('div');
      actionTokenSlot.classList.add('fott-action-token-slot');
      actionTokenSlot.id = `action-token-slot-${tileId}`;
      this.ui.containers.tiles[tileId].appendChild(actionTokenSlot);
    });
  }

  // private setupSetAsideStandees() {
  //   this.setAsideStandees = new LineStock<FottAnimal>(
  //     this.game.animalManager,
  //     this.ui.containers.setAsideStandees,
  //     {}
  //   );
  // }

  private animalDisplay(
    element: HTMLElement,
    cards: FottAnimalToken[],
    lastCard: FottAnimalToken,
    stock: FottManualPositionStock<FottAnimalToken>
    // lastCardOnly = false
  ) {
    cards.forEach((animal, index) => {
      const animalDiv = stock.getCardElement(animal);

      setAbsolutePosition(
        animalDiv,
        TILE_SCALE,
        getAnimalPosition(index, cards.length)
      );
    });
  }

  private setupAnimals(gamedatas: GamedatasAlias) {
    TILES.forEach((tileId) => {
      this.animalStocks[tileId] = new FottManualPositionStock<FottAnimal>(
        this.game.animalManager,
        this.ui.containers.tiles[tileId],
        {},
        this.animalDisplay
      );
    });

    this.updateAnimals(gamedatas);
  }

  private setupActionTokens(gamedatas: GamedatasAlias) {
    TILES.forEach((tileId) => {
      const actionTokenSlot = document.createElement('div');
      actionTokenSlot.classList.add('fott-action-token-slot');
      actionTokenSlot.id = `action-token-slot-${tileId}`;
      this.ui.containers.tiles[tileId].appendChild(actionTokenSlot);
      this.actionTokenStocks[tileId] = new LineStock<FottActionToken>(
        this.game.actionTokenManager,
        actionTokenSlot,
        {}
      );
    });

    this.updateActionTokens(gamedatas);
  }

  private setupZoomControls() {
    const index = this.changeZoomLevel(0);
    const zoomInButton = document.getElementById('fott-zoom-in-btn');
    const zoomOutButton = document.getElementById('fott-zoom-out-btn');

    zoomInButton.addEventListener('click', () => {
      const index = this.changeZoomLevel(1);
      if (index === ZOOM_LEVELS.length - 1) {
        zoomInButton.classList.add('disabled');
      }
      zoomOutButton.classList.remove('disabled');
    });

    zoomOutButton.addEventListener('click', () => {
      const index = this.changeZoomLevel(-1);
      if (index === 0) {
        zoomOutButton.classList.add('disabled');
      }
      zoomInButton.classList.remove('disabled');
    });
    if (index === 0) {
      zoomOutButton.classList.add('disabled');
    }
    if (index === ZOOM_LEVELS.length - 1) {
      zoomInButton.classList.add('disabled');
    }
  }

  private changeZoomLevel(change: number) {
    const currentZoom =
      Number(localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY)) ?? 1;

    let index = ZOOM_LEVELS.indexOf(currentZoom);
    index = index < 0 ? 0 : index;

    let newIndex = index + change;

    newIndex = newIndex < 0 ? 0 : newIndex;
    newIndex =
      newIndex >= ZOOM_LEVELS.length ? ZOOM_LEVELS.length - 1 : newIndex;

    const newZoomLevel = ZOOM_LEVELS[newIndex];
    document.documentElement.style.setProperty(
      '--tileSizeMultiplier',
      `${newZoomLevel}`
    );

    localStorage.setItem(LOCAL_STORAGE_ZOOM_KEY, `${newZoomLevel}`);

    return newIndex;
  }

  private checkButtonsDisabled() {

  }

  // .##.....##.########..########.....###....########.########....##.....##.####
  // .##.....##.##.....##.##.....##...##.##......##....##..........##.....##..##.
  // .##.....##.##.....##.##.....##..##...##.....##....##..........##.....##..##.
  // .##.....##.########..##.....##.##.....##....##....######......##.....##..##.
  // .##.....##.##........##.....##.#########....##....##..........##.....##..##.
  // .##.....##.##........##.....##.##.....##....##....##..........##.....##..##.
  // ..#######..##........########..##.....##....##....########.....#######..####

  private updateAnimals(gamedatas: GamedatasAlias) {
    Object.entries(gamedatas.animals).forEach(([id, animal]) => {
      if (TILES.includes(animal.location)) {
        this.animalStocks[animal.location].addCard(animal);
      }
      // else if (animal.location === SET_ASIDE_STANDEES) {
      //   this.setAsideStandees.addCard(animal);
      // }
    });
  }

  private async updateAnimalsAsync(gamedatas: GamedatasAlias) {
    console.log('updateAnimalsAsync');
    await Promise.all(
      Object.values(gamedatas.animals).map(async (animal) => {
        if (TILES.includes(animal.location)) {
          await this.animalStocks[animal.location].addCard(animal);
        }
        // else if (animal.location === SET_ASIDE_STANDEES) {
        //   await this.setAsideStandees.addCard(animal);
        // }
      })
    );
  }

  private updateActionTokens(gamedatas: GamedatasAlias) {
    Object.entries(gamedatas.actionTokens).forEach(([id, token]) => {
      const slot = this.actionTokenStocks[token.location];
      if (slot) {
        slot.addCard(token);
      }
    });
  }

  private async updateActionTokensAsync(gamedatas: GamedatasAlias) {
    await Promise.all(
      Object.values(gamedatas.actionTokens).map(async (token) => {
        const slot = this.actionTokenStocks[token.location];
        if (slot) {
          await slot.addCard(token);
        }
      })
    );
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...
}
