<?php

namespace Bga\Games\FoxOnTheTree\Animals;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;

class Predator extends \Bga\Games\FoxOnTheTree\Models\Animal
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->type = PREDATOR;
  }

  public function getDestinationTile()
  {
    $phase = Globals::getPhase();
    if ($phase === FIRST_PHASE) {
      return FARM;
    }
    if ($phase === SECOND_PHASE) {
      return LAIR_OF_PREDATORS;
    }
  }

  public function getStartingTile()
  {
    $phase = Globals::getPhase();
    if ($phase === FIRST_PHASE) {
      return LAIR_OF_PREDATORS;
    }
    if ($phase === SECOND_PHASE) {
      return FARM;
    }
  }

  public function isOnFinalTile()
  {
    $phase = Globals::getPhase();
    if ($phase === FIRST_PHASE && $this->getLocation() === FARM) {
      return true;
    }
    if ($phase === SECOND_PHASE && $this->getLocation() === LAIR_OF_PREDATORS) {
      return true;
    }
    return false;
  }

  public function getDirection()
  {
    return Globals::getPhase() === FIRST_PHASE ? LEFT : RIGHT;
  }

  public function getSpecialMoves()
  {
    $specialMove = $this->getTileWithOffset($this->getDirection() * 2);
    return $specialMove !== null ? [$specialMove] : [];
  }
}
