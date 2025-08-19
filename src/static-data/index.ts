class StaticData {
  private static instance: StaticData;
  private game: GameAlias;
  private staticData: FoxOnTheTreeGamedatas['staticData'];

  constructor(game: GameAlias) {
    this.game = game;
    this.staticData = game.gamedatas.staticData;
  }

  public static create(game: GameAlias) {
    StaticData.instance = new StaticData(game);
  }

  public static get() {
    return StaticData.instance;
  }

  // ..######..########.########.##.....##.########.
  // .##....##.##..........##....##.....##.##.....##
  // .##.......##..........##....##.....##.##.....##
  // ..######..######......##....##.....##.########.
  // .......##.##..........##....##.....##.##.......
  // .##....##.##..........##....##.....##.##.......
  // ..######..########....##.....#######..##.......


}
