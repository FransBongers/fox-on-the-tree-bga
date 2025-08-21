<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;


class ActionToken extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;
  protected $table = 'action_tokens';
  protected $primary = 'action_token_id';
  protected $location;
  protected $state;


  protected $attributes = [
    'id' => ['action_token_id', 'str'],
    'location' => 'action_token_location',
    'state' => ['action_token_state', 'int'],
  ];

  protected $staticAttributes = [

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
