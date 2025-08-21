<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;


class Card extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;
  protected $table = 'cards';
  protected $primary = 'card_id';
  protected $location;
  protected $state;

  protected $favored;
  protected $unfavored;

  protected $attributes = [
    'id' => ['card_id', 'str'],
    'location' => 'card_location',
    'state' => ['card_state', 'int'],
  ];

  protected $staticAttributes = [
    'favored',
    'unfavored'
  ];
  public function jsonSerialize(): array
  {
    $data = parent::jsonSerialize();
    // return array_merge($data, [
      
    // ]);
    return $data;
  }

  public function getUiData()
  {
    // Notifications::log('getUiData card model', []);
    return $this->jsonSerialize(); // Static datas are already in js file
  }

}
