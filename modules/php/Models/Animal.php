<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;


class Animal extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;
  protected $table = 'animals';
  protected $primary = 'animal_id';
  protected $location;
  protected $state;

  protected $type;

  protected $attributes = [
    'id' => ['animal_id', 'str'],
    'location' => 'animal_location',
    'state' => ['animal_state', 'int'],
  ];

  protected $staticAttributes = [
    'type'
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
