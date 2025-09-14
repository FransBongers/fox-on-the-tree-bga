<?php

namespace Bga\Games\FoxOnTheTree\Managers;

use Bga\GameFramework\Notify;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;



class Animals extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Pieces
{
  protected static $table = 'animals';
  protected static $prefix = 'animal_';
  protected static $customFields = [
    'facing',
    'points_phase_1',
    'points_phase_2',
  ];
  protected static $autoremovePrefix = false;
  protected static $autoreshuffle = false;
  protected static $autoIncrement = false;

  protected static function cast($card)
  {
    return self::getCardInstance($card['animal_id'], $card);
  }

  public static function getCardInstance($id, $data = null)
  {
    // $prefix = self::getClassPrefix($id);

    $className = "\Bga\Games\FoxOnTheTree\Animals\\$id";
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
      $animal = self::getCardInstance($animalId);

      $isFarmAnimal = $animal->isFarmAnimal();

      $animals[$animalId] = [
        'id' => $animalId,
        'location' => $isFarmAnimal ? FARM : LAIR_OF_PREDATORS,
        'facing' => $isFarmAnimal ? 'right' : 'left'
      ];
    }

    // Create the cards
    self::create($animals, null);
    self::shuffle(FARM);
    self::shuffle(LAIR_OF_PREDATORS);
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
