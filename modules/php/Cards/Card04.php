<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card04 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card04';
    $this->favored = [WOLF, TIGER];
    $this->unfavored = PIG;
  }
}
