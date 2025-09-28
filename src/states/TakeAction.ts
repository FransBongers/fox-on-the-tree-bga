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
    if (!this.canSwampRescue() && this.canMoveAnimal()) {
      this.updateInterfaceSelectAnimalToMove();
      return;
    }
    if (this.canSwampRescue() && !this.canMoveAnimal()) {
      this.updateInterfaceSelectSwampToken();
      return;
    }

    this.updatePageTitle();

    if (this.canMoveAnimal()) {
      addSecondaryActionButton({
        id: 'move_btn',
        text: formatStringRecursive(_('Move animal ${tkn_animal}'), {
          tkn_animal: PIG,
        }),
        callback: () => this.updateInterfaceSelectAnimalToMove(),
      });
    }
    if (this.canSwampRescue()) {
      addSecondaryActionButton({
        id: 'rescue_btn',
        text: formatStringRecursive(
          _('Rescue from the swamp ${tkn_actionToken}'),
          {
            tkn_actionToken: SWAMP,
          }
        ),
        callback: () => this.updateInterfaceSelectSwampToken(),
      });
    }

    Object.values(this.args.animals).forEach((moveOptions) => {
      const { animal } = moveOptions;
      onClick(document.getElementById(animal.id), () => {
        this.updateInterfaceSelectTile(moveOptions);
      });
    });
    this.args.swampTokens.forEach((token) => {
      onClick(document.getElementById(token.id), () => {
        this.updateInterfaceConfirmSwampRescue(token);
      });
    });

    addUndoButtons(this.args, 'undo');
  }

  updateInterfaceSelectAnimalToMove() {
    this.game.clearPossible();

    updatePageTitle(_('${you} must choose an animal to move'), {});

    // Object.entries(this.args.animals).forEach(([animalId, moveOptions]) => {
    //   addSecondaryActionButton({
    //     id: `move-${animalId}-btn`,
    //     text: formatStringRecursive(_('Move ${tkn_animal}'), {
    //       tkn_animal: animalId,
    //     }),
    //     callback: () => this.updateInterfaceSelectTile(moveOptions),
    //   });
    // });
    Object.values(this.args.animals).forEach((moveOptions) => {
      const { animal } = moveOptions;
      onClick(document.getElementById(animal.id), () => {
        this.updateInterfaceSelectTile(moveOptions);
      });
    });
    if (this.canSwampRescue()) {
      addCancelButton();
    } else {
      addUndoButtons(this.args, 'undo');
    }
  }

  updateInterfaceSelectSwampToken() {
    this.game.clearPossible();

    updatePageTitle(_('${you} must choose a ${tkn_actionToken}'), {
      tkn_actionToken: SWAMP,
    });

    this.args.swampTokens.forEach((token) => {
      onClick(document.getElementById(token.id), () => {
        this.updateInterfaceConfirmSwampRescue(token);
      });
    });
    if (this.canMoveAnimal()) {
      addCancelButton();
    } else {
      addUndoButtons(this.args, 'undo');
    }
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

    const callback = () => {
      performAction('actTakeAction', {
        actionType: MOVE,
        animalId: animal.id,
        tileId,
        actionTokenId: null,
      });
    };

    callback();
  }

  private updateInterfaceConfirmSwampRescue(actionToken: FottActionToken) {
    clearPossible();

    updatePageTitle(_('Remove ${tkn_actionToken} from ${tkn_tile} ?'), {
      tkn_actionToken: actionToken.type,
      tkn_tile: actionToken.location,
    });

    setSelected(document.getElementById(actionToken.id));

    const callback = () =>
      performAction('actTakeAction', {
        actionType: SWAMP_RESCUE,
        animalId: null,
        tileId: actionToken.location,
        actionTokenId: actionToken.id,
      });

    callback();
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
    updatePageTitle(_('${you} must choose:'));
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
