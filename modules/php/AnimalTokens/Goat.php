<?php

namespace Bga\Games\FoxOnTheTree\AnimalTokens;

class Goat extends \Bga\Games\FoxOnTheTree\Models\AnimalToken
{
    public function __construct($row)
  {
    parent::__construct($row);
    $this->id = GOAT;
  }
}
