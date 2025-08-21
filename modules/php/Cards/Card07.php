<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card07 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card07';
    $this->favored = [COW, TIGER];
    $this->unfavored = BEAR;
  }
}
