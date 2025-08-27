<?php

namespace Bga\Games\FoxOnTheTree\Models;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Globals;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\AnimalTokens;

class Animal extends \Bga\Games\FoxOnTheTree\Boilerplate\Helpers\DB_Model
{
  protected $id;
  protected $table = 'animals';
  protected $primary = 'animal_id';
  protected $location;
  protected $state;
  protected $pointsPhase1;
  protected $pointsPhase2;

  protected $type;

  protected $attributes = [
    'id' => ['animal_id', 'str'],
    'location' => 'animal_location',
    'state' => ['animal_state', 'int'],
    'pointsPhase1' => ['points_phase_1', 'int'],
    'pointsPhase2' => ['points_phase_2', 'int'],
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

  public function isOnTile()
  {
    return in_array($this->getLocation(), TILES);
  }

  public function getMoveOptions()
  {
    // Needs to be on a tile
    if (!$this->isOnTile() || ActionTokens::getTokenOfTypeOnTile($this->getLocation(), SWAMP) !== null) {
      return [
        'basic' => null,
        'special' => [],
      ];
    };

    return [
      'basic' => $this->getBasicMove(),
      'special' => $this->getSpecialMoves(),
    ];
  }

  public function getTileWithOffset($offset)
  {
    $index = Utils::array_find_index(TILES, function ($tileId) {
      return $tileId === $this->getLocation();
    });
    if ($index === -1) {
      throw new \feException("ERROR_005");
    }
    $newIndex = $index + $offset;
    if ($newIndex < 0 || $newIndex >= count(TILES)) {
      return null;
    }
    return TILES[$newIndex];
  }

  public function getBasicMove()
  {
    return $this->getTileWithOffset($this->getDirection());
  }

  public function getSpecialMoves()
  {
    return [];
  }

  public function bananaMove($player)
  {
    $this->moveTo($player, $this->getBasicMove(), BANANA);
  }

  public function moveTo($player, $tileId, $moveType)
  {
    $this->setLocation($tileId);

    Notifications::moveAnimal($player, $this, $tileId, $moveType);

    $bananaToken = ActionTokens::getTokenOfTypeOnTile($tileId, BANANA);
    if ($bananaToken != null) {
      $this->bananaMove($player);
      $bananaToken->discard($player);
    }
  }

  public function isPredator()
  {
    return $this->type === PREDATOR;
  }

  public function isFarmAnimal()
  {
    return $this->type === FARM_ANIMAL;
  }

  public function getDirection()
  {
    return Globals::getPhase() === FIRST_PHASE ? RIGHT : LEFT;
  }

  public function isOnFinalTile()
  {
    return false;
  }

  public function getDestinationTile()
  {
    return null;
  }

  public function getStartingTile()
  {
    return null;
  }

  public function getScoreForCurrentPhase($phase)
  {
    return $phase === FIRST_PHASE ? $this->getPointsPhase1() : $this->getPointsPhase2();
  }

  public function getHighestUnoccupied($animals, $phase)
  {
    for ($i = 8; $i >= 1; $i--) {
      $animalWithScore = Utils::array_some($animals, function ($animal) use ($phase, $i) {
        return $animal->getScoreForCurrentPhase($phase) === $i;
      });
      if ($animalWithScore) {
        continue;
      }
      return $i;
      break;
    }
  }

  public function getLowestUnoccupied($animals, $phase)
  {
    for ($i = 1; $i <= 8; $i++) {
      $animalWithScore = Utils::array_some($animals, function ($animal) use ($phase, $i) {
        return $animal->getScoreForCurrentPhase($phase) === $i;
      });
      if ($animalWithScore) {
        continue;
      }
      return $i;
      break;
    }
  }

  public function scorePoints($phase, $points)
  {
    if ($phase === FIRST_PHASE) {
      $this->setPointsPhase1($points);
      $this->setLocation(SET_ASIDE_STANDEES);
      $animalToken = AnimalTokens::get($this->getId());
      $animalToken->setLocation(Locations::points($points));
      Notifications::scorePoints($this, $phase, $points, $animalToken);
    } else {
      $this->setPointsPhase2($points);
      $this->setLocation(Locations::points($points));
      Notifications::scorePoints($this, $phase, $points);
    }
  }

  public function reachDestination()
  {
    $phase = Globals::getPhase();
    $animals = Animals::getAll()->toArray();

    $hightestUnoccupied = $this->getHighestUnoccupied($animals, $phase);

    $this->scorePoints($phase, $hightestUnoccupied);
  }

  public function eliminate()
  {
    Notifications::message(clienttranslate('${tkn_animal} is eliminated'), [
      'tkn_animal' => $this->getId(),
    ]);
    $phase = Globals::getPhase();
    $animals = Animals::getAll()->toArray();

    $lowestUnoccupied = $this->getLowestUnoccupied($animals, $phase);

    $this->scorePoints($phase, $lowestUnoccupied);
  }

  public function getTotalPoints()
  {
    return $this->getPointsPhase1() + $this->getPointsPhase2();
  }
}
