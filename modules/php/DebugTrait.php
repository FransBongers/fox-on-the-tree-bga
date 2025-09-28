<?php

namespace Bga\Games\FoxOnTheTree;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Stats;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Cards;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\AnimalTokens;
use Bga\Games\FoxOnTheTree\Managers\AtomicActions;
use Bga\Games\FoxOnTheTree\Managers\Players;

trait DebugTrait
{
  function setupItem($item, $families) {}




  function debug_test()
  {
    // $player = Players::getAll()->toArray()[0];
    // Stats::incNumberOfAnimalsMoved($player->getId(), 1);
    Stats::checkExistence();
    // AtomicActions::get(PRE_END_OF_GAME)->stPreEndOfGame();
  }

  function debug_engineDisplay()
  {
    Notifications::log('engine', Globals::getEngine());
  }
}
