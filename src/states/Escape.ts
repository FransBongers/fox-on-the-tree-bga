interface OnEnteringEscapeArgs extends CommonStateArgs {
  options: Record<string, string>;
}

class Escape implements State {
  private static instance: Escape;
  private args: OnEnteringEscapeArgs;

  constructor(private game: GameAlias) {}

  public static create(game: GameAlias) {
    Escape.instance = new Escape(game);
  }

  public static getInstance() {
    return Escape.instance;
  }

  onEnteringState(args: OnEnteringEscapeArgs) {
    debug('Entering Escape state');
    this.args = args;
    this.updateInterfaceInitialStep();
  }

  onLeavingState() {
    debug('Leaving Escape state');
  }

  setDescription(activePlayerIds: number, args: OnEnteringEscapeArgs) {
    updatePageTitle(
      _('Other players may use ${tkn_actionToken}'),
      {
        tkn_actionToken: ESCAPE,
      },
      true
    );
  }

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
    if (Object.keys(this.args.options).length > 1) {
      this.updateInterfaceSelectAnimal();
      return;
    }

    const animalId = Object.entries(this.args.options)[0][0];
    const tileId = Object.entries(this.args.options)[0][1];

    updatePageTitle(
      _(
        '${you} may use ${tkn_actionToken} to return ${tkn_animal} to ${tkn_tile}'
      ),
      {
        tkn_actionToken: ESCAPE,
        tkn_animal: animalId,
        tkn_tile: tileId,
      }
    );

    addSecondaryActionButton({
      id: 'use_btn',
      text: formatStringRecursive(_('Use ${tkn_actionToken}'), {
        tkn_actionToken: ESCAPE,
      }),
      callback: () => {
        performAction('actEscape', {
          animalId,
          skip: false,
        });
      },
    });

    addSecondaryActionButton({
      id: 'do_not_use_btn',
      text: formatStringRecursive(_('Do not use'), {
        tkn_actionToken: ESCAPE,
      }),
      callback: () => {
        performAction('actEscape', {
          animalId: null,
          skip: true,
        });
      },
    });
  }

  private updateInterfaceSelectAnimal() {
    clearPossible();
    updatePageTitle(
      _('${you} may select an animal to rescure with ${tkn_actionToken}'),
      {
        tkn_actionToken: ESCAPE,
      }
    );
    const board = Board.getInstance();
    Object.entries(this.args.options).forEach(([animalId, tileId]) => {
      onClick(board.ui.animals[animalId], () => {
        this.updateInterfaceConfirm(animalId);
      });
    });

    addSecondaryActionButton({
      id: 'do_not_use_btn',
      text: formatStringRecursive(_('Do not use ${tkn_actionToken}'), {
        tkn_actionToken: ESCAPE,
      }),
      callback: () => {
        performAction('actEscape', {
          animalId: null,
          skip: true,
          tkn_actionToken: ESCAPE,
        });
      },
    });
  }

  private updateInterfaceConfirm(animalId: string) {
    clearPossible();

    const tileId = this.args.options[animalId];

    updatePageTitle(
      _('Use ${tkn_actionToken} to return ${tkn_animal} to ${tkn_tile}'),
      {
        tkn_actionToken: ESCAPE,
        tkn_animal: animalId,
        tkn_tile: tileId,
      }
    );

    addConfirmButton(() => {
      performAction('actEscape', {
        animalId,
        skip: false,
      });
    });

    addCancelButton();
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

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
