<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card01 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card01';
    $this->favored = [GOAT, PIG];
    $this->unfavored = COW;
  }
}
