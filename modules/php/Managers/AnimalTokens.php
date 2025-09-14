<?php

namespace Bga\Games\FoxOnTheTree\Managers;

use Bga\GameFramework\Notify;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;



class AnimalTokens extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Pieces
{
  protected static $table = 'animal_tokens';
  protected static $prefix = 'animal_token_';
  protected static $customFields = [];
  protected static $autoremovePrefix = false;
  protected static $autoreshuffle = false;
  protected static $autoIncrement = false;

  protected static function cast($card)
  {
    return self::getCardInstance($card['animal_token_id'], $card);
  }

  public static function getCardInstance($id, $data = null)
  {
    // $prefix = self::getClassPrefix($id);

    $className = "\Bga\Games\FoxOnTheTree\Models\AnimalToken";
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
    $animals = [];

    foreach (ANIMALS as $index => $animalId) {
      foreach ([PHASE_1, PHASE_2] as $phase) {
        $id = $animalId . '_' . $phase;
        $animals[$id] = [
          'id' => $id,
          'location' => SUPPLY,
        ];
      }
    }

    // Create the cards
    self::create($animals, null);
    self::shuffle(SUPPLY);
  }



  /* Creation of the cards */
  public static function setupNewGame($players = null, $options = null)
  {
    self::setupLoadCards();
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...


}
