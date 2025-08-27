<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Preferences;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Cards;
use Bga\Games\FoxOnTheTree\Managers\IndictmentCards;
use Bga\Games\FoxOnTheTree\Managers\Pawns;
use Bga\Games\FoxOnTheTree\Managers\PlayerCubes;
use Bga\Games\FoxOnTheTree\Managers\ViceCards;

/*
 * Player: all utility functions concerning a player
 */

class Player extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;

  protected $table = 'player';
  protected $primary = 'player_id';
  protected $attributes = [
    'id' => ['player_id', 'int'],
    'no' => ['player_no', 'int'],
    'avatar' => 'player_avatar',
    'name' => 'player_name',
    'hexColor' => 'player_color',
    'eliminated' => 'player_eliminated',
    'score' => ['player_score', 'int'],
    'scoreAux' => ['player_score_aux', 'int'],
    'zombie' => 'player_zombie',
  ];


  /*
   * Getters
   */
  public function getPref($prefId)
  {
    return Preferences::get($this->id, $prefId);
  }

  public function jsonSerialize($currentPlayerId = null): array
  {
    $data = parent::jsonSerialize();
    $isCurrentPlayer = intval($currentPlayerId) == $this->getId();

    $cards =  Cards::getInLocation(Locations::hand($this->getId()))->toArray();

    return array_merge(
      $data,
      [
        'card' => $isCurrentPlayer && count($cards) > 0 ? $cards[0] : null,
      ],
    );
  }

  public function getId()
  {
    return (int) parent::getId();
  }

  public function getCard()
  {
    return Cards::getInLocation(Locations::hand($this->getId()))->toArray()[0];
  }
}
