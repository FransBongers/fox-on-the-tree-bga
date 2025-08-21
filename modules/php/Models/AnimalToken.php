<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;


class AnimalToken extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;
  protected $table = 'animal_tokens';
  protected $primary = 'animal_token_id';
  protected $location;
  protected $state;

  protected $attributes = [
    'id' => ['animal_token_id', 'str'],
    'location' => 'animal_token_location',
    'state' => ['animal_token_state', 'int'],
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
