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
  public actionTokens: LineStock<FottActionToken>;

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
    this.actionTokens = new LineStock<FottActionToken>(
      this.game.actionTokenManager,
      document.getElementById(`actionTokens_${this.playerId}`),
      {
        gap: '4px',
      }
    );

    this.updatePlayerPanel(gamedatas);
  }

  updatePlayerBoard(playerGamedatas: PlayerDataAlias) {}

  updatePlayerPanel(gamedatas: GamedatasAlias) {
    const playerData = gamedatas.players[this.playerId];
    const card = playerData.card;
    if (card) {
      const node = document.getElementById(`card_${this.playerId}`);
      if (node) {
        node.insertAdjacentHTML('afterbegin', tplCard(card.id));
      }
    }
    Object.values(gamedatas.actionTokens).forEach((actionToken) => {
      if (actionToken.location === `actionTokens_${this.playerId}`) {
        this.actionTokens.addCard(actionToken);
      }
    });
  }

  async updateActionTokensAsync(gamedatas: GamedatasAlias) {
    await Promise.all(
      Object.values(gamedatas.actionTokens).map(async (actionToken) => {
        if (actionToken.location === `actionTokens_${this.playerId}`) {
          await this.actionTokens.addCard(actionToken);
        }
      })
    );
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
