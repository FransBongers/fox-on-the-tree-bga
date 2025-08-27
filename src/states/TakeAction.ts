interface AnimalMoveOptions {
  animal: FottAnimal;
  basic: string | null;
  special: string[];
}

interface OnEnteringTakeActionArgs extends CommonStateArgs {
  animals: Record<string, AnimalMoveOptions>;
  swampTokens: FottActionToken[];
}

class TakeAction implements State {
  private static instance: TakeAction;
  private args: OnEnteringTakeActionArgs;

  constructor(private game: GameAlias) {}

  public static create(game: GameAlias) {
    TakeAction.instance = new TakeAction(game);
  }

  public static getInstance() {
    return TakeAction.instance;
  }

  onEnteringState(args: OnEnteringTakeActionArgs) {
    debug('Entering TakeAction state');
    this.args = args;

    this.updateInterfaceInitialStep();
  }

  onLeavingState() {
    debug('Leaving TakeAction state');
  }

  setDescription(activePlayerIds: number, args: OnEnteringTakeActionArgs) {}

  //  .####.##....##.########.########.########..########....###.....######..########
  //  ..##..###...##....##....##.......##.....##.##.........##.##...##....##.##......
  //  ..##..####..##....##....##.......##.....##.##........##...##..##.......##......
  //  ..##..##.##.##....##....######...########..######...##.....##.##.......######..
  //  ..##..##..####....##....##.......##...##...##.......#########.##.......##......
  //  ..##..##...###....##....##.......##....##..##.......##.....##.##....##.##......
  //  .####.##....##....##....########.##.....##.##.......##.....##..######..########

  // ..######..########.########.########...######.
  // .##....##....##....##.......##.....##.##....##
  // .##..........##....##.......##.....##.##......
  // ..######.....##....######...########...######.
  // .......##....##....##.......##..............##
  // .##....##....##....##.......##........##....##
  // ..######.....##....########.##.........######.

  private updateInterfaceInitialStep() {
    this.game.clearPossible();

    this.updatePageTitle();

    const board = Board.getInstance();
    const tokens = Tokens.getInstance();

    if (this.canMoveAnimal()) {
      addPrimaryActionButton({
        id: 'move_btn',
        text: _('Move an animal'),
        callback: () => this.updateInterfaceSelectAnimalToMove(),
      });
    }
    if (this.canSwampRescue()) {
      addPrimaryActionButton({
        id: 'rescue_btn',
        text: formatStringRecursive(_('Perform a swamp rescue'), {}),
        callback: () => this.updateInterfaceSelectSwampToken(),
      });
    }

    Object.values(this.args.animals).forEach((moveOptions) => {
      const { animal } = moveOptions;
      onClick(board.ui.animals[animal.id], () => {
        this.updateInterfaceSelectTile(moveOptions);
      });
    });
    this.args.swampTokens.forEach((token) => {
      onClick(tokens.ui.actionTokens[token.id], () => {
        this.updateInterfaceConfirmSwampRescue(token);
      });
    });

    addUndoButtons(this.args);
  }

  updateInterfaceSelectAnimalToMove() {
    this.game.clearPossible();

    updatePageTitle(_('${you} must choose an animal to move'), {});

    Object.entries(this.args.animals).forEach(([animalId, moveOptions]) => {
      addSecondaryActionButton({
        id: `move-${animalId}-btn`,
        text: formatStringRecursive(_('Move ${tkn_animal}'), {
          tkn_animal: animalId,
        }),
        callback: () => this.updateInterfaceSelectTile(moveOptions),
      });
    });
    addCancelButton();
  }

  updateInterfaceSelectSwampToken() {
    this.game.clearPossible();

    updatePageTitle(_('${you} must choose a ${tkn_actionToken} to remove'), {
      tkn_actionToken: SWAMP,
    });

    this.args.swampTokens.forEach((token) => {
      onClick(Tokens.getInstance().ui.actionTokens[token.id], () => {
        this.updateInterfaceConfirmSwampRescue(token);
      });
    });
    addCancelButton();
  }

  private updateInterfaceSelectTile(moveOptions: AnimalMoveOptions) {
    clearPossible();
    // Only one target
    if (moveOptions.basic !== null && moveOptions.special.length === 0) {
      this.updateInterfaceConfirmMove(moveOptions.animal, moveOptions.basic);
      return;
    }

    if (moveOptions.basic !== null) {
      onClick(moveOptions.basic, () => {
        this.updateInterfaceConfirmMove(moveOptions.animal, moveOptions.basic);
      });
    }

    moveOptions.special.forEach((tileId) => {
      if (tileId === moveOptions.basic) {
        return;
      }
      onClick(tileId, () => {
        this.updateInterfaceConfirmMove(moveOptions.animal, tileId);
      });
    });

    addCancelButton();
  }

  private updateInterfaceConfirmMove(animal: FottAnimal, tileId: string) {
    clearPossible();

    updatePageTitle(_('Move ${tkn_animal} to ${tkn_tile} ?'), {
      tkn_animal: animal.id,
      tkn_tile: tileId,
    });
    setSelected(tileId);

    const callback = () =>
      performAction('actTakeAction', {
        actionType: MOVE,
        animalId: animal.id,
        tileId,
        actionTokenId: null,
      });

    if (
      Settings.getInstance().get(
        PREF_CONFIRM_END_OF_TURN_AND_PLAYER_SWITCH_ONLY
      ) === PREF_ENABLED
    ) {
      callback();
    } else {
      addConfirmButton(callback);
    }

    addCancelButton();
  }

  private updateInterfaceConfirmSwampRescue(actionToken: FottActionToken) {
    clearPossible();

    updatePageTitle(_('Remove ${tkn_actionToken} from ${tkn_tile} ?'), {
      tkn_actionToken: actionToken.type,
      tkn_tile: actionToken.location,
    });

    setSelected(Tokens.getInstance().ui.actionTokens[actionToken.id]);

    const callback = () =>
      performAction('actTakeAction', {
        actionType: SWAMP_RESCUE,
        animalId: null,
        tileId: actionToken.location,
        actionTokenId: actionToken.id,
      });

    if (
      Settings.getInstance().get(
        PREF_CONFIRM_END_OF_TURN_AND_PLAYER_SWITCH_ONLY
      ) === PREF_ENABLED
    ) {
      callback();
    } else {
      addConfirmButton(callback);
    }

    addCancelButton();
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  private canMoveAnimal(): boolean {
    return Object.keys(this.args.animals).length > 0;
  }

  private canSwampRescue(): boolean {
    return this.args.swampTokens.length > 0;
  }

  private updatePageTitle() {
    const canMoveAnimal = this.canMoveAnimal();
    const canSwampRescue = this.canSwampRescue();
    if (canMoveAnimal && canSwampRescue) {
      updatePageTitle(
        _('${you} must move an animal or perform a Swamp Rescue')
      );
    } else if (canMoveAnimal) {
      updatePageTitle(_('${you} must move an animal'));
    } else if (canSwampRescue) {
      updatePageTitle(_('${you} must perform a Swamp Rescue'));
    }
  }

  //  ..######..##.......####..######..##....##
  //  .##....##.##........##..##....##.##...##.
  //  .##.......##........##..##.......##..##..
  //  .##.......##........##..##.......#####...
  //  .##.......##........##..##.......##..##..
  //  .##....##.##........##..##....##.##...##.
  //  ..######..########.####..######..##....##

  // .##.....##....###....##....##.########..##.......########..######.
  // .##.....##...##.##...###...##.##.....##.##.......##.......##....##
  // .##.....##..##...##..####..##.##.....##.##.......##.......##......
  // .#########.##.....##.##.##.##.##.....##.##.......######....######.
  // .##.....##.#########.##..####.##.....##.##.......##.............##
  // .##.....##.##.....##.##...###.##.....##.##.......##.......##....##
  // .##.....##.##.....##.##....##.########..########.########..######.
}
