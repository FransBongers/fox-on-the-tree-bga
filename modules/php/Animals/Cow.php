<?php

namespace Bga\Games\FoxOnTheTree\Animals;

class Cow extends \Bga\Games\FoxOnTheTree\Animals\FarmAnimal
{
    public function __construct($row)
  {
    parent::__construct($row);
    $this->id = COW;
  }
}
