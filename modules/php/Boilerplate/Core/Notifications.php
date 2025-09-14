<?php

namespace Bga\Games\FoxOnTheTree\Boilerplate\Core;

use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Managers\Players;
use Bga\Games\FoxOnTheTree\Managers\Sites;

class Notifications
{
  // .########...#######..####.##.......########.########.
  // .##.....##.##.....##..##..##.......##.......##.....##
  // .##.....##.##.....##..##..##.......##.......##.....##
  // .########..##.....##..##..##.......######...########.
  // .##.....##.##.....##..##..##.......##.......##...##..
  // .##.....##.##.....##..##..##.......##.......##....##.
  // .########...#######..####.########.########.##.....##

  // .########..##..........###....########.########
  // .##.....##.##.........##.##......##....##......
  // .##.....##.##........##...##.....##....##......
  // .########..##.......##.....##....##....######..
  // .##........##.......#########....##....##......
  // .##........##.......##.....##....##....##......
  // .##........########.##.....##....##....########
  protected static function notifyAll($name, $msg, $data)
  {
    self::updateArgs($data);
    Game::get()->notifyAllPlayers($name, $msg, $data);
  }

  protected static function notify($player, $name, $msg, $data)
  {
    $playerId = is_int($player) ? $player : $player->getId();
    self::updateArgs($data);
    Game::get()->notifyPlayer($playerId, $name, $msg, $data);
  }

  public static function message($txt, $args = [])
  {
    self::notifyAll('message', $txt, $args);
  }

  public static function messageTo($player, $txt, $args = [])
  {
    $playerId = is_int($player) ? $player : $player->getId();
    self::notify($playerId, 'message', $txt, $args);
  }

  // TODO: check how to handle this in game log
  public static function newUndoableStep($player, $stepId)
  {
    self::notify($player, 'newUndoableStep', clienttranslate('Undo to here'), [
      'stepId' => $stepId,
      'preserve' => ['stepId'],
    ]);
  }

  public static function clearTurn($player, $notifIds)
  {
    self::notifyAll('clearTurn', clienttranslate('${player_name} restarts their turn'), [
      'player' => $player,
      'notifIds' => $notifIds,
    ]);
  }

  public static function refreshUIPrivate($player, $privateData)
  {
    self::notify($player, 'refreshUIPrivate', '', array_merge([
      'player' => $player,
    ], $privateData));
  }

  public static function refreshUI($data)
  {
    unset($data['playerOrder']);
    unset($data['playerorder']);
    unset($data['staticData']);
    unset($data['gamestates']);

    foreach ($data['players'] as $playerId => $player) {
      unset($data['players'][$playerId]['card']);
    }

    self::notifyAll('refreshUI', '', [
      // 'datas' => $fDatas,
      'data' => $data
    ]);
  }



  public static function log($message, $data)
  {
    self::notifyAll('log', '', [
      'message' => $message,
      'data' => $data,
    ]);
  }

  public static function phase($text, $args = [])
  {
    self::notifyAll('phase', $text, $args);
  }

  // .##.....##.########..########.....###....########.########
  // .##.....##.##.....##.##.....##...##.##......##....##......
  // .##.....##.##.....##.##.....##..##...##.....##....##......
  // .##.....##.########..##.....##.##.....##....##....######..
  // .##.....##.##........##.....##.#########....##....##......
  // .##.....##.##........##.....##.##.....##....##....##......
  // ..#######..##........########..##.....##....##....########

  // ....###....########...######....######.
  // ...##.##...##.....##.##....##..##....##
  // ..##...##..##.....##.##........##......
  // .##.....##.########..##...####..######.
  // .#########.##...##...##....##........##
  // .##.....##.##....##..##....##..##....##
  // .##.....##.##.....##..######....######.

  /*
   * Automatically adds some standard field about player and/or card
   */
  protected static function updateArgs(&$args)
  {
    if (isset($args['player'])) {
      $args['player_name'] = $args['player']->getName();
      $args['playerId'] = $args['player']->getId();
      unset($args['player']);
    }
  }


  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...


  private static function getAnimalsLog($animals)
  {
    $animalsLog = '';
    $animalsLogArgs = [];

    foreach ($animals as $index => $animal) {
      $key = 'tkn_animal_' . $index;
      $animalsLog = $animalsLog . '${' . $key . '}';
      $animalsLogArgs[$key] = $animal->getId();
    }

    return [
      'log' => $animalsLog,
      'args' => $animalsLogArgs,
    ];
  }

  // ..######......###....##.....##.########
  // .##....##....##.##...###...###.##......
  // .##.........##...##..####.####.##......
  // .##...####.##.....##.##.###.##.######..
  // .##....##..#########.##.....##.##......
  // .##....##..##.....##.##.....##.##......
  // ..######...##.....##.##.....##.########

  // .##....##..#######..########.####.########..######.
  // .###...##.##.....##....##.....##..##.......##....##
  // .####..##.##.....##....##.....##..##.......##......
  // .##.##.##.##.....##....##.....##..######....######.
  // .##..####.##.....##....##.....##..##.............##
  // .##...###.##.....##....##.....##..##.......##....##
  // .##....##..#######.....##....####.##........######.

  public static function conflictResult($result, $winningAnimals, $eliminatedAnimals)
  {
    $text = '';
    $args = [
      'animals_log' => self::getAnimalsLog($winningAnimals),
    ];

    $multipleWinners = count($winningAnimals) > 1;

    if ($result === FARM_ANIMALS_OUTNUMBER) {
      $text = clienttranslate('${animals_log} outnumber the predators');
    } else if ($result === FARM_ANIMAL_ON_PREVIOUS_TILE) {
      $text = $multipleWinners ? clienttranslate('${animals_log} are supported by a farm animal on the previous tile') : clienttranslate('${animals_log} is supported by a farm animal on the previous tile');
    } else if ($result === PREDATORS_ARE_STRONGER) {
      $text = $multipleWinners ? clienttranslate('${animals_log} are stronger than the farm animals') : clienttranslate('${animals_log} is stronger than the farm animal');
    }

    self::message($text, $args);
  }

  public static function discardActionToken($player, $actionToken, $location)
  {
    $args = [
      'player' => $player,
      'actionToken' => $actionToken,
      'location' => $location,
      'tkn_actionToken' => $actionToken->getType(),
    ];

    $text = clienttranslate('${player_name} discards ${tkn_actionToken}');
    if (in_array($location, TILES)) {
      $text = clienttranslate('${player_name} discards ${tkn_actionToken} from ${tkn_tile}');
      $args['tkn_tile'] = $location;
    }

    self::notifyAll('discardActionToken', $text, $args);
  }

  public static function moveAnimal($player, $animal, $tileId, $moveType)
  {
    $text = clienttranslate('${player_name} moves ${tkn_animal} to ${tkn_tile}');
    $args = [
      'player' => $player,
      'animal' => $animal->jsonSerialize(),
      'tileId' => $tileId,
      'tkn_animal' => $animal->getId(),
      'tkn_tile' => $tileId,
    ];

    if ($moveType === SPECIAL  && $animal->isPredator()) {
      $text = clienttranslate('${player_name} uses Jump to move ${tkn_animal} to ${tkn_tile}');
    } else if ($moveType === SPECIAL && $animal->isFarmAnimal()) {
      $text = clienttranslate('${player_name} uses Dodge to move ${tkn_animal} to ${tkn_tile}');
    } else if ($moveType === BANANA) {
      $text = clienttranslate('${player_name} moves ${tkn_animal} one tile further to ${tkn_tile} due to ${tkn_actionToken}');
      $args['tkn_actionToken'] = BANANA;
    }
    if ($moveType === RETURN_TO_STARTING_TILE) {
      $text = clienttranslate('${player_name} uses ${tkn_actionToken} to return ${tkn_animal} to ${tkn_tile}');
      $args['tkn_actionToken'] = ESCAPE;
    }

    self::notifyAll('moveAnimal', $text, $args);
  }

  public static function placeActionToken($player, $actionToken, $tileId)
  {
    self::notifyAll('placeActionToken', clienttranslate('${player_name} places ${tkn_actionToken} on ${tkn_tile}'), [
      'player' => $player,
      'tileId' => $tileId,
      'actionToken' => $actionToken,
      'tkn_actionToken' => $actionToken->getType(),
      'tkn_tile' => $tileId,
    ]);
  }

  public static function revealCard($player, $card)
  {
    self::message(clienttranslate('${player_name} reveals their card ${tkn_card}'), [
      'player' => $player,
      'card' => $card,
      'tkn_card' => $card->getId(),
    ]);
  }

  public static function scorePoints($animal, $phase, $numberOfPoints, $animalToken)
  {
    $text = $numberOfPoints === 1 ? clienttranslate('${tkn_animal} scores ${tkn_boldText_number} point') : clienttranslate('${tkn_animal} scores ${tkn_boldText_number} points');
    self::notifyAll('scorePoints', $text, [
      'phase' => $phase,
      'animal' => $animal->jsonSerialize(),
      'animalToken' => $animalToken,
      'tkn_boldText_number' => $numberOfPoints,
      'tkn_animal' => $animal->getId(),
    ]);
  }

  public static function scorePointsForAnimal($player, $animal, $pointsForAnimal)
  {
    $text = $pointsForAnimal < 0 ? clienttranslate('${player_name} subtracts ${tkn_boldText_number} points for ${tkn_animal}') : clienttranslate('${player_name} earns ${tkn_boldText_number} points for ${tkn_animal}');
    self::notifyAll('scorePointsForAnimal', $text, [
      'player' => $player,
      'tkn_boldText_number' => abs($pointsForAnimal),
      'points' => $pointsForAnimal,
      'tkn_animal' => $animal->getId(),
    ]);
  }
}
