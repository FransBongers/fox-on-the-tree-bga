// class Tokens {
//   private static instance: Tokens;
//   private game: GameAlias;

//   public ui: {
//     actionTokens: Record<string, HTMLElement>;
//   };

//   constructor(game: GameAlias) {
//     this.game = game;
//     this.setup(game.gamedatas);
//   }

//   public static create(game: GameAlias) {
//     Tokens.instance = new Tokens(game);
//   }

//   public static getInstance() {
//     return Tokens.instance;
//   }

//   // ..######..########.########.##.....##.########.
//   // .##....##.##..........##....##.....##.##.....##
//   // .##.......##..........##....##.....##.##.....##
//   // ..######..######......##....##.....##.########.
//   // .......##.##..........##....##.....##.##.......
//   // .##....##.##..........##....##.....##.##.......
//   // ..######..########....##.....#######..##.......

//   // Setup functions
//   setup(gamedatas: GamedatasAlias) {
//     this.ui = {
//       actionTokens: {},
//     };

//     this.setupActionTokens(gamedatas);
//   }

//   private setupActionTokens(gamedatas: GamedatasAlias) {
//     const playerIs = PlayerManager.getInstance().getPlayerIds();
//     Object.values(gamedatas.actionTokens).forEach(({ id, type }) => {
//       const elt = (this.ui.actionTokens[id] = document.createElement('div'));
//       elt.classList.add('fott-action-token');
//       elt.dataset.type = type;

//       // this.ui.containers.dangerousCruisingMarkers.appendChild(elt);
//     });
//     this.updateActionTokens(gamedatas);
//   }

//   private setupSelectBoxes() {}

//   // .##.....##.########..########.....###....########.########....##.....##.####
//   // .##.....##.##.....##.##.....##...##.##......##....##..........##.....##..##.
//   // .##.....##.##.....##.##.....##..##...##.....##....##..........##.....##..##.
//   // .##.....##.########..##.....##.##.....##....##....######......##.....##..##.
//   // .##.....##.##........##.....##.#########....##....##..........##.....##..##.
//   // .##.....##.##........##.....##.##.....##....##....##..........##.....##..##.
//   // ..#######..##........########..##.....##....##....########.....#######..####

//   private updateActionTokens(gamedatas: GamedatasAlias) {
//     Object.values(gamedatas.actionTokens).forEach(({ id, location }) => {
//       const node = document.getElementById(location);
//       if (!node) {
//         return;
//       }
//       node.appendChild(this.ui.actionTokens[id]);
//     });
//   }

//   //  .##.....##.########.####.##.......####.########.##....##
//   //  .##.....##....##.....##..##........##.....##.....##..##.
//   //  .##.....##....##.....##..##........##.....##......####..
//   //  .##.....##....##.....##..##........##.....##.......##...
//   //  .##.....##....##.....##..##........##.....##.......##...
//   //  .##.....##....##.....##..##........##.....##.......##...
//   //  ..#######.....##....####.########.####....##.......##...
// }
