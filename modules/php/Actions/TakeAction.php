<?php

namespace Bga\Games\FoxOnTheTree\Actions;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\AtomicActions;
use Bga\Games\FoxOnTheTree\Models\Animal;

class TakeAction extends \Bga\Games\FoxOnTheTree\Models\AtomicAction
{
  public function getState()
  {
    return ST_TAKE_ACTION;
  }

  // ....###....########...######....######.
  // ...##.##...##.....##.##....##..##....##
  // ..##...##..##.....##.##........##......
  // .##.....##.########..##...####..######.
  // .#########.##...##...##....##........##
  // .##.....##.##....##..##....##..##....##
  // .##.....##.##.....##..######....######.


  public function argsTakeAction()
  {
    $info = $this->ctx->getInfo();

    $data = [
      'animals' => $this->getAnimalsMoveOptions(),
      'swampTokens' => $this->getSwampRescueOptions(),
    ];

    return $data;
  }

  //  .########..##..........###....##....##.########.########.
  //  .##.....##.##.........##.##....##..##..##.......##.....##
  //  .##.....##.##........##...##....####...##.......##.....##
  //  .########..##.......##.....##....##....######...########.
  //  .##........##.......#########....##....##.......##...##..
  //  .##........##.......##.....##....##....##.......##....##.
  //  .##........########.##.....##....##....########.##.....##

  // ....###.....######..########.####..#######..##....##
  // ...##.##...##....##....##.....##..##.....##.###...##
  // ..##...##..##..........##.....##..##.....##.####..##
  // .##.....##.##..........##.....##..##.....##.##.##.##
  // .#########.##..........##.....##..##.....##.##..####
  // .##.....##.##....##....##.....##..##.....##.##...###
  // .##.....##..######.....##....####..#######..##....##

  public function actPassTakeAction()
  {
    $player = self::getPlayer();
    // Stats::incPassActionCount($player->getId(), 1);
    // Engine::resolve(PASS);
    $this->resolveAction(PASS);
  }

  public function actTakeAction($args)
  {
    self::checkAction('actTakeAction');

    $actionType = $args->actionType;
    $animalId = $args->animalId;
    $tileId = $args->tileId;
    $actionTokenId = $args->actionTokenId;

    if (!in_array($actionType, [MOVE, SWAMP_RESCUE])) {
      throw new \feException("ERROR_006");
    }

    switch ($actionType) {
      case MOVE:
        $this->move($animalId, $tileId);
        break;
      case SWAMP_RESCUE:
        $this->swampRescue($actionTokenId);
        break;
    }

    $this->resolveAction(['actionType' => $actionType]);
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  public function move($animalId, $tileId)
  {
    $options = $this->getAnimalsMoveOptions();

    if (!isset($options[$animalId])) {
      throw new \feException("ERROR_007");
    }

    $optionsForAnimal = $options[$animalId];
    $animal = $optionsForAnimal['animal'];

    if (!($optionsForAnimal['basic'] === $tileId  || in_array($tileId, $optionsForAnimal['special']))) {
      throw new \feException("ERROR_008");
    }

    $animal->moveTo($this->getPlayer(), $tileId, $tileId === $optionsForAnimal['basic'] ? BASIC : SPECIAL);

    // Get animal again to have fresh data
    // It might have moved because of banana
    $animal = Animals::get($animalId);
    $this->checkConflict($animal->getId(), $animal->getLocation());
  }

  public function checkConflict($animalId, $tileId)
  {
    $animalsInLocation = Animals::getInLocation($tileId);
    $hasPredator = false;
    $hasFarmAnimal = false;
    foreach ($animalsInLocation as $a) {
      if ($a->isPredator()) {
        $hasPredator = true;
      } else {
        $hasFarmAnimal = true;
      }
    }
    if ($hasFarmAnimal && $hasPredator) {
      $action = [
        'action' => RESOLVE_CONFLICT,
        'animalId' => $animalId,
        'tileId' => $tileId,
        'playerId' => $this->ctx->getPlayerId(),
      ];
      $this->ctx->insertAsBrother(Engine::buildTree($action));
      //   AtomicActions::createConflict($tileId);
    }
    // else {
    //   $action = [
    //     'action' => CHECK_REACH_FINAL_TILE,
    //     'animalId' => $animalId,
    //     'tileId' => $tileId,
    //     'playerId' => $this->ctx->getPlayerId(),
    //   ];
    //   $this->ctx->insertAsBrother(Engine::buildTree($action));
    // }
  }

  public function swampRescue($actionTokenId)
  {
    $options = $this->getSwampRescueOptions();

    $actionToken = Utils::array_find($options, function ($t) use ($actionTokenId) {
      return $t->getId() == $actionTokenId;
    });

    if ($actionToken === null) {
      throw new \feException("ERROR_009");
    }

    $actionToken->discard($this->getPlayer());
  }

  public function getAnimalsMoveOptions()
  {
    $animals = Animals::getAll();
    $options = [];

    foreach ($animals as $animal) {
      $moveOptions = $animal->getMoveOptions();

      if ($moveOptions['basic'] != null || count($moveOptions['special']) > 0) {
        $moveOptions['animal'] = $animal;
        $options[$animal->getId()] = $moveOptions;
      }
    }

    return $options;
  }

  public function getSwampRescueOptions()
  {
    $actionTokens = ActionTokens::getAll();
    $animals = Animals::getAll()->toArray();
    $options = [];

    foreach ($actionTokens as $actionToken) {
      $location = $actionToken->getLocation();
      if (!in_array($location, PATH_TILES)) {
        continue;
      }

      if (Utils::array_some($animals, function ($a) use ($location) {
        return $a->getLocation() === $location;
      })) {
        $options[] = $actionToken;
      }
    }

    return $options;
  }
}
