//  .##....##..#######..########.####.########
//  .###...##.##.....##....##.....##..##......
//  .####..##.##.....##....##.....##..##......
//  .##.##.##.##.....##....##.....##..######..
//  .##..####.##.....##....##.....##..##......
//  .##...###.##.....##....##.....##..##......
//  .##....##..#######.....##....####.##......

//  .##.....##....###....##....##....###.....######...########.########.
//  .###...###...##.##...###...##...##.##...##....##..##.......##.....##
//  .####.####..##...##..####..##..##...##..##........##.......##.....##
//  .##.###.##.##.....##.##.##.##.##.....##.##...####.######...########.
//  .##.....##.#########.##..####.#########.##....##..##.......##...##..
//  .##.....##.##.....##.##...###.##.....##.##....##..##.......##....##.
//  .##.....##.##.....##.##....##.##.....##..######...########.##.....##

const MIN_NOTIFICATION_MS = 1200;

class NotificationManager {
  private static instance: NotificationManager;
  private game: GameAlias;
  private subscriptions: unknown[];
  private id: string;

  constructor(game: GameAlias) {
    this.game = game;
    this.subscriptions = [];
  }

  public static create(game: GameAlias) {
    NotificationManager.instance = new NotificationManager(game);
  }

  public static getInstance() {
    return NotificationManager.instance;
  }

  // ..######..########.########.##.....##.########.
  // .##....##.##..........##....##.....##.##.....##
  // .##.......##..........##....##.....##.##.....##
  // ..######..######......##....##.....##.########.
  // .......##.##..........##....##.....##.##.......
  // .##....##.##..........##....##.....##.##.......
  // ..######..########....##.....#######..##.......

  setupNotifications() {
    console.log('notifications subscriptions setup');

    dojo.connect(this.game.framework().notifqueue, 'addToLog', () => {
      this.game.addLogClass();
    });

    /**
     * In general:
     * private is only for owning player
     * all is for both players and spectators
     * public / no suffix is for other player and spectators, not owning player
     */
    const notifs: string[] = [
      // Boilerplate
      'log',
      'message',
      'phase',
      'refreshUI',
      'refreshUIPrivate',
      // Game specific
      'discardActionToken',
      'moveAnimal',
      'placeActionToken',
      'scorePoints',
      'scorePointsForAnimal',
    ];

    // example: https://github.com/thoun/knarr/blob/main/src/knarr.ts
    notifs.forEach((notifName) => {
      this.subscriptions.push(
        dojo.subscribe(notifName, this, (notifDetails: Notif<unknown>) => {
          debug(`notif_${notifName}`, notifDetails); // log notif params (with Tisaac log method, so only studio side)

          const promise = this[`notif_${notifName}`](notifDetails);
          const promises = promise ? [promise] : [];
          let minDuration = 1;

          // Show log messags in page title
          let msg = this.game.format_string_recursive(
            notifDetails.log,
            notifDetails.args as Record<string, unknown>
          );
          // TODO: check if this clearPossible causes any issues?
          // this.game.clearPossible();
          if (msg != '') {
            $('gameaction_status').innerHTML = msg;
            $('pagemaintitletext').innerHTML = msg;
            $('generalactions').innerHTML = '';

            // If there is some text, we let the message some time, to be read
            minDuration = MIN_NOTIFICATION_MS;
          }

          // Promise.all([...promises, sleep(minDuration)]).then(() =>
          //   this.game.framework().notifqueue.onSynchronousNotificationEnd()
          // );
          // tell the UI notification ends, if the function returned a promise.
          if (this.game.animationManager.animationsActive()) {
            Promise.all([...promises, sleep(minDuration)]).then(() =>
              this.game.framework().notifqueue.onSynchronousNotificationEnd()
            );
          } else {
            // TODO: check what this does
            this.game.framework().notifqueue.setSynchronousDuration(0);
          }
        })
      );
      this.game.framework().notifqueue.setSynchronous(notifName, undefined);

      // Setup notifs that need to be ignored
      [].forEach((notifId) => {
        this.game
          .framework()
          .notifqueue.setIgnoreNotificationCheck(
            notifId,
            (notif: Notif<{ playerId: number }>) =>
              notif.args.playerId == this.game.getPlayerId()
          );
      });
    });
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  destroy() {
    dojo.forEach(this.subscriptions, dojo.unsubscribe);
  }

  getPlayer(playerId: number): PlayerAlias {
    return PlayerManager.getInstance().getPlayer(playerId);
  }

  // .##....##..#######..########.####.########..######.
  // .###...##.##.....##....##.....##..##.......##....##
  // .####..##.##.....##....##.....##..##.......##......
  // .##.##.##.##.....##....##.....##..######....######.
  // .##..####.##.....##....##.....##..##.............##
  // .##...###.##.....##....##.....##..##.......##....##
  // .##....##..#######.....##....####.##........######.

  async notif_log(notif: Notif<unknown>) {
    // this is for debugging php side
    debug('notif_log', notif.args);
  }

  async notif_message(notif: Notif<unknown>) {
    // Only here so messages get displayed in title bar
  }

  async notif_refreshUI(notif: Notif<NotifRefreshUI>) {
    const { data: gamedatas } = notif.args;

    const { players: _players, ...otherData } = gamedatas;

    const updatedGamedatas = {
      ...this.game.gamedatas,
      ...otherData,
    };
    this.game.gamedatas = updatedGamedatas;
    this.game.clearInterface();

    PointsTracker.getInstance().updateInterface(updatedGamedatas);
    const players = PlayerManager.getInstance().getPlayers();
    await Promise.all(
      players.map((player) => player.updateActionTokensAsync(updatedGamedatas))
    );
    await Board.getInstance().updateInterface(updatedGamedatas);
  }

  async notif_refreshUIPrivate(notif: Notif<NotifRefreshUIPrivate>) {
    const { playerId } = notif.args;
    const player = this.getPlayer(playerId);
  }

  async notif_phase(notif: Notif<NotifPhase>) {
    const { phase, animals } = notif.args;
    if (phase !== SECOND_PHASE) {
      return;
    }
    const board = Board.getInstance();

    await Promise.all(
      animals?.map(async (animal) =>
        board.animalStocks[animal.location].addCard(animal)
      ) || []
    );
  }

  async notif_discardActionToken(notif: Notif<NotifDiscardActionToken>) {
    const { playerId, actionToken } = notif.args;

    // TODO: void stock?
    this.game.actionTokenManager.removeCard(actionToken);
  }

  async notif_moveAnimal(notif: Notif<NotifMoveAnimal>) {
    const { playerId, animal, tileId } = notif.args;
    const board = Board.getInstance();

    await board.animalStocks[animal.location].addCard(animal);
  }

  async notif_placeActionToken(notif: Notif<NotifPlaceActionToken>) {
    const { playerId, actionToken, tileId } = notif.args;

    const board = Board.getInstance();

    console.log(board.actionTokenStocks);

    await board.actionTokenStocks[actionToken.location].addCard(actionToken);
  }

  async notif_scorePoints(notif: Notif<NotifScorePoints>) {
    const { animal, animalToken, phase } = notif.args;
    const board = Board.getInstance();

    await Promise.all([
      Board.getInstance().setAsideStandees.addCard(animal),
      PointsTracker.getInstance().tokenSpots[animalToken.location].addCard(
        animalToken
      ),
    ]);
  }

  async notif_scorePointsForAnimal(notif: Notif<NotifScorePointsForAnimal>) {
    const { points, playerId } = notif.args;
    incScore(playerId, points);
  }
}
