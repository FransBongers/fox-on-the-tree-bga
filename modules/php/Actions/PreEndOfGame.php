<?php

namespace Bga\Games\FoxOnTheTree\Actions;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine\LeafNode;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\Players;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;

class PreEndOfGame extends \Bga\Games\FoxOnTheTree\Models\AtomicAction
{
  public function getState()
  {
    return ST_PRE_END_OF_GAME;
  }

  // ..######..########....###....########.########
  // .##....##....##......##.##......##....##......
  // .##..........##.....##...##.....##....##......
  // ..######.....##....##.....##....##....######..
  // .......##....##....#########....##....##......
  // .##....##....##....##.....##....##....##......
  // ..######.....##....##.....##....##....########

  // ....###.....######..########.####..#######..##....##
  // ...##.##...##....##....##.....##..##.....##.###...##
  // ..##...##..##..........##.....##..##.....##.####..##
  // .##.....##.##..........##.....##..##.....##.##.##.##
  // .#########.##..........##.....##..##.....##.##..####
  // .##.....##.##....##....##.....##..##.....##.##...###
  // .##.....##..######.....##....####..#######..##....##

  public function stPreEndOfGame()
  {
    /**
     * TODO
     * - calculate final scores
     * - stats
     * - tie breakers
     */
    $animals = Animals::getAll();
    $players = Players::getAll();
    foreach ($players as $player) {
      $points = 0;
      $card = $player->getCard();
      foreach ($card->getFavored() as $animalId) {
        $animal = $animals[$animalId];
        $points += $animal->getTotalPoints();;
      }
      $points -= $animals[$card->getUnfavored()]->getTotalPoints();
      $player->setScore($points);
      Notifications::message(
        clienttranslate('${player_name} scores ${points} points from their card'),
        [
          'player' => $player,
          'points' => $points
        ]
      );
      $player->setScoreAux(ActionTokens::countInLocation(Locations::actionTokens($player->getId())));
    }


    Game::get()->gamestate->jumpToState(ST_END_GAME);
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

}
