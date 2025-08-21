<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card03 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card03';
    $this->favored = [GOAT, FOX];
    $this->unfavored = TIGER;
  }
}
