<?php

namespace Bga\Games\FoxOnTheTree\ActionTokens;

use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;



class Escape extends \Bga\Games\FoxOnTheTree\Models\ActionToken
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->type = ESCAPE;
  }

  public function getOptions()
  {
    $options = [];

    foreach (Animals::getAll() as $animal) {
      if (!in_array($animal->getLocation(), PATH_TILES)) {
        continue;
      }
      $options[$animal->getId()] = $animal->getStartingTile();
    }

    return $options;
  }
}
