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
     * - stats
     */
    $animals = Animals::getAll();
    $players = Players::getAll();
    foreach ($players as $player) {
      $points = 0;
      $card = $player->getCard();
      Notifications::revealCard($player, $card);
      foreach ($card->getFavored() as $animalId) {
        $animal = $animals[$animalId];
        $pointsForAnimal = $animal->getTotalPoints();
        $player->incScore($pointsForAnimal);
        Notifications::scorePointsForAnimal($player, $animal, $pointsForAnimal);
      }

      $unfavoredAnimal = $animals[$card->getUnfavored()];
      $pointsForUnfavoredAnimal = $unfavoredAnimal->getTotalPoints() * -1;
      $player->incScore($pointsForUnfavoredAnimal);
      Notifications::scorePointsForAnimal($player, $unfavoredAnimal, $pointsForUnfavoredAnimal);

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
