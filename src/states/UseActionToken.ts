interface OnEnteringUseActionTokenArgs extends CommonStateArgs {
  options: {
    Banana?: string[];
    Swamp?: string[];
    Escape?: Record<string, string>;
  };
}

class UseActionToken implements State {
  private static instance: UseActionToken;
  private args: OnEnteringUseActionTokenArgs;

  constructor(private game: GameAlias) {}

  public static create(game: GameAlias) {
    UseActionToken.instance = new UseActionToken(game);
  }

  public static getInstance() {
    return UseActionToken.instance;
  }

  onEnteringState(args: OnEnteringUseActionTokenArgs) {
    debug('Entering UseActionToken state');
    this.args = args;

    this.updateInterfaceInitialStep();
  }

  onLeavingState() {
    debug('Leaving UseActionToken state');
  }

  setDescription(activePlayerIds: number, args: OnEnteringUseActionTokenArgs) {}

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
    clearPossible();

    updatePageTitle(_('${you} may use an action token'), {});

    ACTION_TOKENS.forEach((token) => {
      if (
        ([BANANA, SWAMP].includes(token) &&
          this.args.options[token] &&
          (this.args.options[token] as string[]).length > 0) ||
        (token === ESCAPE &&
          this.args.options.Escape &&
          Object.keys(this.args.options.Escape).length > 0)
      ) {
        addSecondaryActionButton({
          id: `${token}-btn`,
          text: formatStringRecursive(_('Use ${tkn_actionToken}'), {
            tkn_actionToken: token,
          }),
          callback: () => this.updateInterfaceSelectOption(token),
        });
      }
    });

    addSecondaryActionButton({
      id: 'pass_btn',
      text: _('Skip'),
      callback: () => {
        performAction('actUseActionToken', {
          skip: true,
          tokenType: null,
          target: null,
        });
      },
      extraClasses: 'fott-button skip-button',
    });
  }

  private updateInterfaceSelectOption(tokenType: ActionTokenType) {
    clearPossible();

    const board = Board.getInstance();

    switch (tokenType) {
      case BANANA:
      case SWAMP:
        updatePageTitle(
          _('${you} may select a Path tile to place ${tkn_actionToken}'),
          {
            tkn_actionToken: tokenType,
          }
        );
        this.args.options[tokenType].forEach((target) =>
          onClick(target, () => {
            this.updateInterfaceConfirm(tokenType, target);
          })
        );
        break;
      case ESCAPE:
        updatePageTitle(
          _('${you} may select an animal to return to their starting tile'),
          {
            tkn_actionToken: tokenType,
          }
        );
        Object.keys(this.args.options[ESCAPE]).forEach((target) =>
          onClick(document.getElementById(target), () => {
            this.updateInterfaceConfirm(tokenType, target);
          })
        );
        break;
    }

    addCancelButton();
  }

  private updateInterfaceConfirm(type: ActionTokenType, target: string) {
    clearPossible();

    const callback = () => {
      performAction('actUseActionToken', {
        skip: false,
        tokenType: type,
        target,
      });
    };
    callback();
    return;

    // switch (type) {
    //   case BANANA:
    //   case SWAMP:
    //     updatePageTitle(_('Place ${tkn_actionToken} on ${tkn_tile} ?'), {
    //       tkn_actionToken: type,
    //       tkn_tile: target,
    //     });
    //     break;
    //   case ESCAPE:
    //     updatePageTitle(
    //       _('Use ${tkn_actionToken} to return ${tkn_animal} to ${tkn_tile} ?'),
    //       {
    //         tkn_actionToken: type,
    //         tkn_animal: target,
    //         tkn_tile: this.args.options.Escape[target],
    //       }
    //     );
    //     break;
    // }

    // setSelected(target);

    // addConfirmButton(callback);
    // addCancelButton();
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
