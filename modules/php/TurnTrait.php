<?php

namespace Bga\Games\FoxOnTheTree;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\Players;
use Bga\Games\FoxOnTheTree\Managers\ViceCards;
use Bga\Games\FoxOnTheTree\Models\Animal;

trait TurnTrait
{

  function stStartGameEngine()
  {
    // custom order activates stStartOfTurn when it's a players turn
    $this->initCustomDefaultTurnOrder('default', 'stStartOfTurn', 'not_used', true, false);

    // $node = [
    //   'children' => [
    //     [
    //       // 'action' => PLAYER_SETUP_CHOOSE_CARD,
    //       // 'playerId' => 'all',
    //     ],
    //   ],
    // ];

    // // Inserting leaf Action card
    // Engine::setup($node, ['method' => 'stNextPlayer']);
    // Engine::proceed();

    $this->stNextPlayer();
  }

  function stStartOfTurn()
  {
    $player = Players::getActive();
    $playerId = $player->getId();
    self::giveExtraTime($playerId);

    $nodes = [];

    Notifications::phase(clienttranslate('${player_name} starts their turn'), [
      'player' => $player,
    ]);

    $nodes = array_merge($nodes, [
      [
        'action' => USE_ACTION_TOKEN,
        'playerId' => $playerId,
        'optional' => true,
      ],
      [
        'action' => TAKE_ACTION,
        'playerId' => $playerId,
      ],
      [
        'action' => CHECK_REACH_FINAL_TILE,
        'playerId' => $playerId,
      ],
    ]);

    $node = [
      'children' => $nodes,
    ];

    Engine::setup($node, ['method' => 'stEndOfPhase']);
    Engine::proceed();
  }

  function stEndOfPhase()
  {
    // End of pahse when all animals are off the tiles

    $animals = Animals::getAll()->toArray();
    $stillAnimalsOnTiles = Utils::array_some($animals, function (Animal $animal) {
      return $animal->isOnTile();
    });

    if ($stillAnimalsOnTiles) {
      // If there are still animals on tiles, continue with the next player's turn
      $this->stNextPlayer();
      return;
    }


    $phase = Globals::getPhase();

    if ($phase === FIRST_PHASE) {
      // Move to second phase
      $node = [
        'children' => [
          [
            'action' => END_OF_FIRST_PHASE,
          ]
        ],
      ];
      Engine::setup($node, ['method' => 'stStartOfTurn']);
      Engine::proceed();
    } else {
      // Move to end of game
      $node = [
        'children' => [
          [
            'action' => PRE_END_OF_GAME,
          ]
        ],
      ];
      Engine::setup($node, ['method' => 'stNextPlayer']);
      Engine::proceed();
    }
  }


  function stNextPlayer()
  {
    $this->nextPlayerCustomOrder('default');
  }


  public function stGenericNextPlayer() {}


  function endOfGameInit() {}

  function stPreEndOfGame() {}


  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...


}
