<?php

namespace Bga\Games\FoxOnTheTree;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Cards;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\AnimalTokens;

trait DebugTrait
{
  function setupItem($item, $families) {}




  function debug_test()
  {
    AnimalTokens::setupNewGame();


  }

  function debug_engineDisplay()
  {
    Notifications::log('engine', Globals::getEngine());
  }
}
