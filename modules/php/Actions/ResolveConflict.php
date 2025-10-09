<?php

namespace Bga\Games\FoxOnTheTree\Actions;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine\LeafNode;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Managers\AtomicActions;
use Bga\Games\FoxOnTheTree\Managers\Players;

class ResolveConflict extends \Bga\Games\FoxOnTheTree\Models\AtomicAction
{
  public function getState()
  {
    return ST_RESOLVE_CONFLICT;
  }

  // ..######..########....###....########.########
  // .##....##....##......##.##......##....##......
  // .##..........##.....##...##.....##....##......
  // ..######.....##....##.....##....##....######..
  // .......##....##....#########....##....##......
  // .##....##....##....##.....##....##....##......
  // ..######.....##....##.....##....##....########

  // ....###.....######..########.####..#######..##....##
  // ...##.##...##....##....##.....##..##.....##.###...##
  // ..##...##..##..........##.....##..##.....##.####..##
  // .##.....##.##..........##.....##..##.....##.##.##.##
  // .#########.##..........##.....##..##.....##.##..####
  // .##.....##.##....##....##.....##..##.....##.##...###
  // .##.....##..######.....##....####..#######..##....##

  public function stResolveConflict()
  {
    $info = $this->ctx->getInfo();
    $animalId = $info['animalId'];
    $tileId = $info['tileId'];

    Notifications::phase(
      clienttranslate('Conflict on ${tkn_tile}'),
      [
        'tkn_tile' => $tileId,
      ]
    );

    $animalsOnTile = Animals::getInLocation($tileId);
    $farmAnimals = [];
    $predators = [];

    foreach ($animalsOnTile as $animal) {
      if ($animal->isFarmAnimal()) {
        $farmAnimals[] = $animal;
      } else {
        $predators[] = $animal;
      }
    }

    // Times -1 to get direction the farm animals are coming from
    $farmAnimal = $farmAnimals[0];
    $previousTile = $farmAnimal->getTileWithOffset($farmAnimal->getDirection() * -1);
    $previousTileHasFarmAnimal = $previousTile !== null && Utils::array_some(Animals::getInLocation($previousTile)->toArray(), fn($a) => $a->isFarmAnimal());

    $winningAnimals = [];
    $eliminatedAnimals = [];
    $result = null;

    if (count($farmAnimals) > count($predators)) {
      $result = FARM_ANIMALS_OUTNUMBER;
      $eliminatedAnimals = $predators;
      $winningAnimals = $farmAnimals;
    } else if (count($predators) === 1 && count($farmAnimals) && $previousTileHasFarmAnimal) {
      $result = FARM_ANIMAL_ON_PREVIOUS_TILE;
      $eliminatedAnimals = $predators;
      $winningAnimals = $farmAnimals;
    } else {
      $result = PREDATORS_ARE_STRONGER;
      $eliminatedAnimals = $farmAnimals;
      $winningAnimals = $predators;
    }
    Notifications::conflictResult($result, $winningAnimals, $eliminatedAnimals);


    $currentTurnPlayerId = $this->ctx->getPlayerId();
    // Check if animals can escape
    $playersThatCanUseEscapeToken = AtomicActions::get(ESCAPE)->getPlayersThatCanUseEscapeToken($currentTurnPlayerId);

    if (count($playersThatCanUseEscapeToken) > 0) {
      $action = [
        'action' => ESCAPE,
        'animalIds' => Utils::returnIds($eliminatedAnimals),
        'tileId' => $tileId,
        'playerId' => 'some',
        'activePlayerIds' => Utils::returnIds($playersThatCanUseEscapeToken),
        'currentTurnPlayerId' => $currentTurnPlayerId,

      ];
      $this->ctx->insertAsBrother(Engine::buildTree($action));
    } else {
      $action = [
        'action' => ELIMINATE_ANIMALS,
        'animalIds' => Utils::returnIds($eliminatedAnimals),
        'tileId' => $tileId,
      ];
      $this->ctx->insertAsBrother(Engine::buildTree($action));
    }

    $this->resolveAction(['automatic' => true]);
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...


}
