//  .########..##..........###....##....##.########.########.
//  .##.....##.##.........##.##....##..##..##.......##.....##
//  .##.....##.##........##...##....####...##.......##.....##
//  .########..##.......##.....##....##....######...########.
//  .##........##.......#########....##....##.......##...##..
//  .##........##.......##.....##....##....##.......##....##.
//  .##........########.##.....##....##....########.##.....##

class FottPlayer {
  private playerColor: string;
  protected playerId: number;
  private playerName: string;
  public counters: Record<string, IconCounter> = {};

  public ui: Record<string, HTMLElement> = {};

  constructor(private game: GameAlias, player: FoxOnTheTreePlayerData) {
    this.game = game;
    const playerId = player.id;
    this.playerId = Number(playerId);
    this.playerName = player.name;
    this.playerColor = player.color;

    const gamedatas = game.gamedatas;

    this.setupPlayer(gamedatas);
  }

  // .##.....##.##....##.########...#######.
  // .##.....##.###...##.##.....##.##.....##
  // .##.....##.####..##.##.....##.##.....##
  // .##.....##.##.##.##.##.....##.##.....##
  // .##.....##.##..####.##.....##.##.....##
  // .##.....##.##...###.##.....##.##.....##
  // ..#######..##....##.########...#######.

  clearInterface() {}

  updatePlayer(gamedatas: GamedatasAlias) {
    this.updatePlayerPanel(gamedatas);
  }

  // ..######..########.########.##.....##.########.
  // .##....##.##..........##....##.....##.##.....##
  // .##.......##..........##....##.....##.##.....##
  // ..######..######......##....##.....##.########.
  // .......##.##..........##....##.....##.##.......
  // .##....##.##..........##....##.....##.##.......
  // ..######..########....##.....#######..##.......

  // Setup functions
  public setupPlayer(gamedatas: GamedatasAlias) {
    this.setupPlayerBoard(gamedatas);
    this.setupPlayerPanel(gamedatas);
  }

  setupPlayerBoard(gamedatas: GamedatasAlias) {
    const playerGamedatas = gamedatas.players[this.playerId];

    const node = document.getElementById('right-column');

    if (!node) {
      return;
    }

    this.updatePlayerBoard(playerGamedatas);
  }

  setupPlayerPanel(gamedatas: GamedatasAlias) {
    const playerGamedatas = gamedatas.players[this.playerId];

    const node: HTMLElement = document.querySelector(
      `#player_board_${this.playerId} .player-board-game-specific-content`
    );

    if (!node) {
      return;
    }

    node.insertAdjacentHTML('afterbegin', tplPlayerPanelInfo(this.playerId));

    this.updatePlayerPanel(gamedatas);
  }

  updatePlayerBoard(playerGamedatas: PlayerDataAlias) {}

  updatePlayerPanel(gamedatas: GamedatasAlias) {
    const card = gamedatas.players[this.playerId].card;
    if (card) {
      const node = document.getElementById(`card_${this.playerId}`);
      if (node) {
        node.insertAdjacentHTML('afterbegin', tplCard(card.id));
      }
    }
  }

  // ..######...########.########.########.########.########...######.
  // .##....##..##..........##.......##....##.......##.....##.##....##
  // .##........##..........##.......##....##.......##.....##.##......
  // .##...####.######......##.......##....######...########...######.
  // .##....##..##..........##.......##....##.......##...##.........##
  // .##....##..##..........##.......##....##.......##....##..##....##
  // ..######...########....##.......##....########.##.....##..######.

  // ..######..########.########.########.########.########...######.
  // .##....##.##..........##.......##....##.......##.....##.##....##
  // .##.......##..........##.......##....##.......##.....##.##......
  // ..######..######......##.......##....######...########...######.
  // .......##.##..........##.......##....##.......##...##.........##
  // .##....##.##..........##.......##....##.......##....##..##....##
  // ..######..########....##.......##....########.##.....##..######.

  getColor(): string {
    return this.playerColor;
  }

  getName(): string {
    return this.playerName;
  }

  getPlayerId(): number {
    return this.playerId;
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  // ....###.....######..########.####..#######..##....##..######.
  // ...##.##...##....##....##.....##..##.....##.###...##.##....##
  // ..##...##..##..........##.....##..##.....##.####..##.##......
  // .##.....##.##..........##.....##..##.....##.##.##.##..######.
  // .#########.##..........##.....##..##.....##.##..####.......##
  // .##.....##.##....##....##.....##..##.....##.##...###.##....##
  // .##.....##..######.....##....####..#######..##....##..######.
}
