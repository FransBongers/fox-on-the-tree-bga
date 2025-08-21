<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card08 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card08';
    $this->favored = [BEAR, FOX];
    $this->unfavored = WOLF;
  }
}
