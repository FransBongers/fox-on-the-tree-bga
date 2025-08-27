class Board {
  private static instance: Board;
  private game: GameAlias;

  public ui: {
    containers: {
      board: HTMLElement;
      selectBoxes: HTMLElement;
      tiles: Record<string, HTMLElement>;
      setAsideStandees: HTMLElement;
      pointsTracker: HTMLElement;
    };
    animals: Record<string, HTMLElement>;
    selectBoxes: Record<string, HTMLElement>;
  };

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
      .insertAdjacentHTML('afterbegin', tplBoard(gamedatas));

    this.ui = {
      containers: {
        board: document.getElementById('fott-board'),
        selectBoxes: document.getElementById('fott-select-boxes'),
        tiles: {},
        setAsideStandees: document.getElementById('fott-set-aside-standees'),
        pointsTracker: document.getElementById('fott-points-tracker'),
      },
      animals: {},
      selectBoxes: {},
    };
    this.setupTiles();
    this.setupSelectBoxes();
    this.setupAnimals(gamedatas);
  }

  private setupTiles() {
    TILES.forEach((tileId) => {
      this.ui.containers.tiles[tileId] = document.getElementById(tileId);
    });
  }

  private setupAnimals(gamedatas: GamedatasAlias) {
    Object.values(gamedatas.animals).forEach(({ id, type }) => {
      const elt = (this.ui.animals[id] = document.createElement('div'));
      elt.classList.add('fott-animal');
      elt.dataset.animal = id;
      elt.dataset.type = type;
      elt.dataset.phase = gamedatas.phase + '';

      // this.ui.containers.dangerousCruisingMarkers.appendChild(elt);
    });
    this.updateAnimals(gamedatas);
  }

  private setupSelectBoxes() {}

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
        this.ui.containers.tiles[animal.location].appendChild(
          this.ui.animals[id]
        );
      } else if (animal.location === SET_ASIDE_STANDEES) {
        this.ui.containers.setAsideStandees.appendChild(this.ui.animals[id]);
      } else if (animal.location.startsWith('points')) {
        this.ui.containers.pointsTracker.appendChild(this.ui.animals[id]);
      }
    });
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...
}
