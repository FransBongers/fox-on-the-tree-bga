<?php

namespace Bga\Games\FoxOnTheTree\Animals;

class Wolf extends \Bga\Games\FoxOnTheTree\Animals\Predator
{
    public function __construct($row)
  {
    parent::__construct($row);
    $this->id = WOLF;
  }
}
