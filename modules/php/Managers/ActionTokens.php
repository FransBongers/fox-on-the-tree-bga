<?php

namespace Bga\Games\FoxOnTheTree\Managers;

use Bga\GameFramework\Notify;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Managers\Players;

class ActionTokens extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Pieces
{
  protected static $table = 'action_tokens';
  protected static $prefix = 'action_token_';
  protected static $customFields = [];
  protected static $autoremovePrefix = false;
  protected static $autoreshuffle = false;
  protected static $autoIncrement = false;

  protected static function cast($card)
  {
    return self::getCardInstance($card['action_token_id'], $card);
  }

  public static function getCardInstance($id, $data = null)
  {
    // $prefix = self::getClassPrefix($id);
    $type = self::getTypeFromId($id);

    $className = "\Bga\Games\FoxOnTheTree\ActionTokens\\$type";
    return new $className($data);
  }

  /**
   * getStaticUiData : return static data
   */
  public static function getStaticUiData()
  {
    $pieces = self::getAll()->toArray();

    $data = [];
    foreach ($pieces as $index => $piece) {
      $data[$piece->getId()] = $piece->getStaticData();
    }
    return $data;
  }

  // ..######..########.########.##.....##.########.
  // .##....##.##..........##....##.....##.##.....##
  // .##.......##..........##....##.....##.##.....##
  // ..######..######......##....##.....##.########.
  // .......##.##..........##....##.....##.##.......
  // .##....##.##..........##....##.....##.##.......
  // ..######..########....##.....#######..##.......


  private static function setupLoadTokens()
  {
    $players = Players::getAll();

    $actionTokens = [];

    foreach ($players as $pId => $player) {
      foreach (ACTION_TOKENS as $tokenType) {
        $tokenId = implode('_', [$tokenType, $pId]);
        $actionTokens[$tokenId] = [
          'id' => $tokenId,
          'location' => Locations::actionTokens($pId),
        ];
      }
    }

    // Create the cards
    self::create($actionTokens, null);
  }



  /* Creation of the cards */
  public static function setupNewGame($players = null, $options = null)
  {
    self::setupLoadTokens();
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  public static function getTypeFromId($id)
  {
    return explode('_', $id)[0];
  }

  public static function getTokenForPlayer($type, $playerId)
  {
    $tokenId = implode('_', [$type, $playerId]);
    $token = self::get($tokenId);
    if ($token == null) {
      throw new \feException("ERROR_004");
    }
    return $token;
  }

    public static function getTokenOfTypeOnTile($tileId, $type)
  {
    $tokens = self::getInLocation($tileId);
    foreach ($tokens as $token) {
      if ($token->getType() == $type) {
        return $token;
      }
    }
    return null;
  }
}
