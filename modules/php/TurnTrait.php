<?php

namespace Bga\Games\FoxOnTheTree;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Players;
use Bga\Games\FoxOnTheTree\Managers\ViceCards;

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

    $this->stStartOfTurn();
  }

  function stStartOfTurn()
  {
    $player = Players::getActive();
    $playerId = $player->getId();
    self::giveExtraTime($playerId);



    $nodes = [];

    $nodes = array_merge($nodes, [

      [
        'action' => TAKE_ACTION,
        'playerId' => $playerId,
      ],

    ]);

    $node = [
      'children' => $nodes,
    ];

    Engine::setup($node, ['method' => 'stSetupRefillMarket']);
    Engine::proceed();
  }


  function stNextPlayer()
  {
    // Check if ViceDeck is empty

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
