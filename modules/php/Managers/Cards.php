<?php

namespace Bga\Games\FoxOnTheTree\Managers;

use Bga\GameFramework\Notify;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;



class Cards extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Pieces
{
  protected static $table = 'cards';
  protected static $prefix = 'card_';
  protected static $customFields = [

  ];
  protected static $autoremovePrefix = false;
  protected static $autoreshuffle = false;
  protected static $autoIncrement = false;

  protected static function cast($card)
  {
    return self::getCardInstance($card['card_id'], $card);
  }

  public static function getCardInstance($id, $data = null)
  {
    // $prefix = self::getClassPrefix($id);

    $className = "\Bga\Games\FoxOnTheTree\Cards\\$id";
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


  private static function setupLoadCards()
  {
    // Load list of cards
    include dirname(__FILE__) . '/../Cards/list.inc.php';

    $cards = [];


    foreach ($cardIds as $index => $cId) {

      $cards[$cId] = [
        'id' => $cId,
        'location' => DECK,
      ];
    }

    // Create the cards
    self::create($cards, null);
    self::shuffle(DECK);
  }

  private static function dealCards()
  {
    $numberOfCards = 1;
    $players = Players::getAll();
    foreach ($players as $player) {
      $playerId = $player->getId();
      self::pickForLocation($numberOfCards, DECK, Locations::hand($playerId));
    }
  }

  /* Creation of the cards */
  public static function setupNewGame($players = null, $options = null)
  {
    self::setupLoadCards();
    self::dealCards();
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...


}
