<?php

namespace Bga\Games\FoxOnTheTree\Animals;



class FarmAnimal extends \Bga\Games\FoxOnTheTree\Models\Animal
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->type = FARM_ANIMAL;
  }
}
