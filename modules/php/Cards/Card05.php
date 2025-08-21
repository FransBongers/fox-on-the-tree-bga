<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card05 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card05';
    $this->favored = [COW, WOLF];
    $this->unfavored = CHICKEN;
  }
}
