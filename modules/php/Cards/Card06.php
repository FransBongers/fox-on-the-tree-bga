<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card06 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card06';
    $this->favored = [CHICKEN, BEAR];
    $this->unfavored = GOAT;
  }
}
