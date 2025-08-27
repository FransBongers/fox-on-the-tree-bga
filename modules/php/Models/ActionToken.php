<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;

class ActionToken extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;
  protected $table = 'action_tokens';
  protected $primary = 'action_token_id';
  protected $location;
  protected $state;

  protected $type;

  protected $attributes = [
    'id' => ['action_token_id', 'str'],
    'location' => 'action_token_location',
    'state' => ['action_token_state', 'int'],
  ];

  protected $staticAttributes = [
    'type'
  ];
  public function jsonSerialize(): array
  {
    $data = parent::jsonSerialize();
    return array_merge($data, [
      'type' => $this->type
    ]);
  }

  public function getUiData()
  {
    // Notifications::log('getUiData card model', []);
    return $this->jsonSerialize(); // Static datas are already in js file
  }

  public function getOptions()
  {
    return [];
  }

  public function placeOnPathTile($player, $tileId)
  {
    $this->setLocation($tileId);
    Notifications::placeActionToken($player, $this, $tileId); 
  }

  public function use($player, $target)
  {
    switch ($this->type) {
      case BANANA:
      case SWAMP:
        $this->placeOnPathTile($player, $target);
        break;
      case ESCAPE:
        $animal = Animals::get($target);
        $animal->moveTo($player, $animal->getStartingTile(), RETURN_TO_STARTING_TILE);
        $this->discard($player);
        break;
      default:
        throw new \feException("ERROR_003");
    }
  }

  public function discard($player)
  {
    $location = $this->getLocation();
    $this->setLocation(DISCARD);
    Notifications::discardActionToken($player, $this, $location);
  }
}
