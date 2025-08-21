<?php

namespace Bga\Games\FoxOnTheTree\AnimalTokens;

class Pig extends \Bga\Games\FoxOnTheTree\Models\AnimalToken
{
    public function __construct($row)
  {
    parent::__construct($row);
    $this->id = PIG;
  }
}
