<?php

namespace Bga\Games\FoxOnTheTree\Cards;

class Card02 extends \Bga\Games\FoxOnTheTree\Models\Card
{
  public function __construct($row)
  {
    parent::__construct($row);
    $this->id = 'Card02';
    $this->favored = [PIG, CHICKEN];
    $this->unfavored = FOX;
  }
}
