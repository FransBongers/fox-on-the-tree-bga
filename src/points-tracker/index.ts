class PointsTracker {
  private static instance: PointsTracker;
  private game: GameAlias;

  public ui: {
    containers: {
      pointsTracker: HTMLElement;
    };
    tokenSpots: Record<string, HTMLElement>;
  };

  public tokenSpots: Record<string, LineStock<FottAnimalToken>> = {};

  constructor(game: GameAlias) {
    this.game = game;
    this.setup(game.gamedatas);
  }

  public static create(game: GameAlias) {
    PointsTracker.instance = new PointsTracker(game);
  }

  public static getInstance() {
    return PointsTracker.instance;
  }

  // .##.....##.##....##.########...#######.
  // .##.....##.###...##.##.....##.##.....##
  // .##.....##.####..##.##.....##.##.....##
  // .##.....##.##.##.##.##.....##.##.....##
  // .##.....##.##..####.##.....##.##.....##
  // .##.....##.##...###.##.....##.##.....##
  // ..#######..##....##.########...#######.

  public clearInterface() {
    Object.values(this.tokenSpots).forEach((spot) => spot.removeAll());
  }

  public async updateInterface(gamedatas: GamedatasAlias) {
    this.updateAnimalTokens(gamedatas);
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
      .insertAdjacentHTML('beforeend', tplPointsTracker(gamedatas));

    this.ui = {
      containers: {
        pointsTracker: document.getElementById('fott-points-tracker'),
      },
      tokenSpots: {},
    };

    for (let i = 1; i <= 8; i++) {
      [PHASE_1, PHASE_2].forEach((phase) => {
        const id = `points_${phase}_${i}`;
        this.ui.containers.pointsTracker.insertAdjacentHTML(
          'beforeend',
          tplAnimalTokenSpot(id)
        );
        const elt = document.getElementById(id);
        if (elt) {
          this.ui.tokenSpots[id] = elt;
          setAbsolutePosition(
            elt,
            POINTS_TRACKER_SCALE,
            POINTS_SPOTS_CONFIG[id]
          );
        }
        this.tokenSpots[id] = new LineStock<FottAnimalToken>(
          this.game.animalTokenManager,
          elt,
          {}
        );
      });
    }

    this.updateAnimalTokens(gamedatas);
  }

  // .##.....##.########..########.....###....########.########....##.....##.####
  // .##.....##.##.....##.##.....##...##.##......##....##..........##.....##..##.
  // .##.....##.##.....##.##.....##..##...##.....##....##..........##.....##..##.
  // .##.....##.########..##.....##.##.....##....##....######......##.....##..##.
  // .##.....##.##........##.....##.#########....##....##..........##.....##..##.
  // .##.....##.##........##.....##.##.....##....##....##..........##.....##..##.
  // ..#######..##........########..##.....##....##....########.....#######..####

  private updateAnimalTokens(gamedatas: GamedatasAlias) {
    Object.values(gamedatas.animalTokens).forEach((token) => {
      if (token.location.startsWith('points')) {
        this.tokenSpots[token.location].addCard(token);
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
