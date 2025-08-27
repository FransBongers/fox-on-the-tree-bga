<?php

namespace Bga\Games\FoxOnTheTree\Actions;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine\LeafNode;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\Players;

class CheckReachFinalTile extends \Bga\Games\FoxOnTheTree\Models\AtomicAction
{
  public function getState()
  {
    return ST_CHECK_REACH_FINAL_TILE;
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

  public function stCheckReachFinalTile()
  {
    $animals = Animals::getAll();

    foreach ($animals as $animal) {
      if ($animal->getLocation() !== $animal->getDestinationTile()) {
        continue;
      }
      $animal->reachDestination();
    }

    $this->resolveAction(['automatic' => true]);
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

}
