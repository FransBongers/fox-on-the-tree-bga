<?php

namespace Bga\Games\FoxOnTheTree\Managers;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;

class Tiles
{

  public static function getPathTilesWithoutTokensOrAnimals()
  {
    $tiles = [];

    $animals = Animals::getAll();
    $actionTokens = ActionTokens::getAll();
    foreach ($animals as $animal) {
      $location = $animal->getLocation();
      if (in_array($location, PATH_TILES)) {
        $tiles[$location] = true;
      }
    }

    foreach ($actionTokens as $actionToken) {
      $location = $actionToken->getLocation();
      if (in_array($location, PATH_TILES)) {
        $tiles[$location] = true;
      }
    }

    return Utils::filter(PATH_TILES, fn($tile) => !array_key_exists($tile, $tiles));
  }

  public static function getPathTilesWithoutTokens()
  {
    $tiles = [];

    $actionTokens = ActionTokens::getAll();

    foreach ($actionTokens as $actionToken) {
      $location = $actionToken->getLocation();
      if (in_array($location, PATH_TILES)) {
        $tiles[$location] = true;
      }
    }

    return Utils::filter(PATH_TILES, fn($tile) => !array_key_exists($tile, $tiles));
  }
}
