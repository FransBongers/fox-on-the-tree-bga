class Interaction {
  private static instance: Interaction;
  public game: GameAlias;
  private subscriptions: unknown[];
  private id: string;

  constructor(game: GameAlias) {
    this.game = game;
    this.subscriptions = [];
  }

  public static create(game: GameAlias) {
    Interaction.instance = new Interaction(game);
  }

  public static use() {
    return Interaction.instance;
  }

  public addPlayerButton({
    id,
    text,
    playerId,
    callback,
    extraClasses,
  }: {
    id: string;
    text: string;
    playerId: number;
    callback: Function | string;
    extraClasses?: string;
  }) {
    this.addSecondaryActionButton({
      id,
      text,
      callback,
      extraClasses: `player-button ${extraClasses}`,
    });
    const elt = document.getElementById(id);
    const playerColor = PlayerManager.getInstance()
      .getPlayer(playerId)
      .getColor();
    // TODO: use classes so hover effect does not break?
    elt.style.backgroundColor = '#' + playerColor;
  }

  public addPrimaryActionButton({
    id,
    text,
    callback,
    extraClasses,
  }: {
    id: string;
    text: string;
    callback: Function | string;
    extraClasses?: string;
  }) {
    if ($(id)) {
      return;
    }
    this.game
      .framework()
      .addActionButton(id, text, callback, 'customActions', false, 'blue');
    if (extraClasses) {
      dojo.addClass(id, extraClasses);
    }
  }

  addSecondaryActionButton({
    id,
    text,
    callback,
    extraClasses,
  }: {
    id: string;
    text: string;
    callback: Function | string;
    extraClasses?: string;
  }) {
    if ($(id)) {
      return;
    }
    this.game
      .framework()
      .addActionButton(id, text, callback, 'customActions', false, 'gray');
    if (extraClasses) {
      dojo.addClass(id, extraClasses);
    }
  }

  addCancelButton({
    callback,
    extraClasses,
  }: { callback?: Function; extraClasses?: string } = {}) {
    this.addDangerActionButton({
      id: 'cancel_btn',
      text: _('Cancel'),
      callback: () => {
        if (callback) {
          callback();
        }
        this.game.onCancel();
      },
      extraClasses,
    });
  }

  public addConfirmButton(callback: Function) {
    this.addPrimaryActionButton({
      id: 'confirm_btn',
      text: _('Confirm'),
      callback,
    });
  }

  public addDangerActionButton({
    id,
    text,
    callback,
    extraClasses,
  }: {
    id: string;
    text: string;
    callback: Function | string;
    extraClasses?: string;
  }) {
    if ($(id)) {
      return;
    }
    this.game
      .framework()
      .addActionButton(id, text, callback, 'customActions', false, 'red');
    if (extraClasses) {
      dojo.addClass(id, extraClasses);
    }
  }

  public addPassButton(optionalAction: boolean, text?: string) {
    if (optionalAction) {
      this.addSecondaryActionButton({
        id: 'pass_btn',
        text: text ? _(text) : _('Pass'),
        callback: () =>
          this.game.framework().bgaPerformAction('actPassOptionalAction'),
      });
    }
  }

  public addUndoButtons({
    previousSteps,
    previousEngineChoices,
  }: CommonStateArgs, filter = 'both') {
    const lastStep = Math.max(0, ...previousSteps);
    if (lastStep > 0 && ['both', 'undo'].includes(filter)) {
      // this.addDangerActionButton('btnUndoLastStep', _('Undo last step'), () => this.undoToStep(lastStep), 'restartAction');
      this.addDangerActionButton({
        id: 'undo_last_step_btn',
        text: _('Undo last step'),
        extraClasses: 'fott-button',
        callback: () => {
          this.game.framework().bgaPerformAction('actUndoToStep', {
            stepId: lastStep,
          })
          // this.takeAction({
          //   action: 'actUndoToStep',
          //   args: {
          //     stepId: lastStep,
          //   },
          //   checkAction: 'actRestart',
          //   atomicAction: false,
          // });
        },
      });
    }

    if (previousEngineChoices > 0 && ['both', 'restart'].includes(filter)) {
      this.addDangerActionButton({
        id: 'restart_btn',
        text: _('Restart turn'),
        callback: () => {
          this.game.framework().bgaPerformAction('actRestart')
          // this.takeAction({ action: 'actRestart', atomicAction: false }),
        },
      });
    }
  }

  public clearPossible() {
    this.game.clearPossible();
  }

  public clientUpdatePageTitle(
    text: string,
    args: Record<string, string | number | unknown>,
    nonActivePlayers: boolean = false
  ) {
    const title = this.game.format_string_recursive(_(text), args);
    this.game.gamedatas.gamestate.descriptionmyturn = title;
    if (nonActivePlayers) {
      this.game.gamedatas.gamestate.description = title;
    }
    this.game.framework().updatePageTitle();
  }

  public formatStringRecursive(
    log: string,
    args: Record<string, unknown>
  ): string {
    return this.game.format_string_recursive(log, args);
  }

  public onClick(node: HTMLElement, callback: Function, temporary = true) {
    this.game.onClick(node, callback, temporary);
  }

  public setSelected(node: HTMLElement) {
    if (!node) {
      return;
    }
    node.classList.add(SELECTED);
  }

  public performAction(actionName: string, args: Record<string, unknown>) {
    this.game.framework().bgaPerformAction(
      'actTakeAtomicAction',
      {
        actionName,
        args: JSON.stringify(args),
      }
      //  {lock: true, checkAction: false}
    );
  }

  public async wait(ms: number) {
    return await this.game.framework().wait(ms);
  }
}
