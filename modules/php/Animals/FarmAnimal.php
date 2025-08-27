<?php

namespace Bga\Games\FoxOnTheTree\Animals;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;

class FarmAnimal extends \Bga\Games\FoxOnTheTree\Models\Animal
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->type = FARM_ANIMAL;
  }

  public function getDestinationTile()
  {
    $phase = Globals::getPhase();
    if ($phase === FIRST_PHASE) {
      return LAIR_OF_PREDATORS;
    }
    if ($phase === SECOND_PHASE) {
      return FARM;
    }
  }

  public function getStartingTile()
  {
    $phase = Globals::getPhase();
    if ($phase === FIRST_PHASE) {
      return FARM;
    }
    if ($phase === SECOND_PHASE) {
      return LAIR_OF_PREDATORS;
    }
  }

  public function isOnFinalTile()
  {
    $phase = Globals::getPhase();
    if ($phase === FIRST_PHASE && $this->getLocation() === LAIR_OF_PREDATORS) {
      return true;
    }
    if ($phase === SECOND_PHASE && $this->getLocation() === FARM) {
      return true;
    }
    return false;
  }

  public function getSpecialMoves()
  {
    $tiles = [];

    $animals = Animals::getAll();

    foreach ($animals as $animal) {
      $location = $animal->getLocation();
      if (!in_array($location, TILES)) {
        continue;
      }
      if (!isset($tiles[$location])) {
        $tiles[$location] = [
          PREDATOR => false,
          FARM_ANIMAL => false,
        ];
      }
      $tiles[$location][$animal->getType()] = true;
    }

    $index = Utils::array_find_index(TILES, function ($tileId) {
      return $tileId === $this->getLocation();
    });


    $numberOfTiles = count(TILES);
    $direction = $this->getDirection();

    $options = [];

    while ($index >= 0 && $index < $numberOfTiles) {
      $index += $direction;
      if ($index < 0 || $index >= $numberOfTiles) {
        break;
      }

      $tileId = TILES[$index];
      // End of the row
      if (!isset($tiles[$tileId])) {
        $options[] = $tileId;
        break;
      }
      // Cannot end of spaces with Predator
      if ($tiles[$tileId][PREDATOR]) {
        continue;
      }
      if ($tiles[$tileId][FARM_ANIMAL]) {
        $options[] = $tileId;
      }
    }

    return $options;
  }
}
