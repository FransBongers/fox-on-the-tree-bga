<?php

namespace Bga\Games\FoxOnTheTree\ActionTokens;

use Bga\Games\FoxOnTheTree\Managers\Tiles;

class Swamp extends \Bga\Games\FoxOnTheTree\Models\ActionToken
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->type = SWAMP;
  }

    public function getOptions()
  {
    return Tiles::getPathTilesWithoutTokens();
  }
}
