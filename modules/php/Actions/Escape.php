<?php

namespace Bga\Games\FoxOnTheTree\Actions;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Engine;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Core\Stats;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Utils;
use Bga\Games\FoxOnTheTree\Managers\Animals;
use Bga\Games\FoxOnTheTree\Game;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Managers\Players;
use Bga\Games\FoxOnTheTree\Models\Player;

class Escape extends \Bga\Games\FoxOnTheTree\Models\AtomicAction
{
  public function getState()
  {
    return ST_ESCAPE;
  }

  // ....###....########...######....######.
  // ...##.##...##.....##.##....##..##....##
  // ..##...##..##.....##.##........##......
  // .##.....##.########..##...####..######.
  // .#########.##...##...##....##........##
  // .##.....##.##....##..##....##..##....##
  // .##.....##.##.....##..######....######.

  public function argsEscape()
  {
    $info = $this->ctx->getInfo();

    $data = [
      'options' => $this->getOptions(Animals::getMany($info['animalIds'])),
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

  public function actPassEscape()
  {
    $player = self::getPlayer();
    $this->resolveAction(PASS);
  }

  public function actEscape($args)
  {
    self::checkAction('actEscape');

    $animalId = $args->animalId;
    $skip = $args->skip;

    $player = Players::getCurrent();

    $game = Game::get();
    if ($skip) {
      $this->handleSkip($game, $player);
    } else {
      $this->handleEscape($game, $player, $animalId);
    }

    // Make the player inactive
    if (count($game->gamestate->getActivePlayerList()) > 0) {
      return;
    }

    $this->resolveAction([], true);
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  private function addElminiateAnimalsState($animalIds, $tileId)
  {
    $action = [
      'action' => ELIMINATE_ANIMALS,
      'animalIds' => $animalIds,
      'tileId' => $tileId,
    ];
    $this->ctx->insertAsBrother(Engine::buildTree($action));
  }


  private function handleSkip($game, $player)
  {
    Notifications::message(
      clienttranslate('${player_name} does not use ${tkn_actionToken}'),
      [
        'player' => $player,
        'tkn_actionToken' => ESCAPE,
      ]
    );
    $game->gamestate->setPlayerNonMultiactive($player->getId(), 'next');
    if (count($game->gamestate->getActivePlayerList()) === 0) {
      // Last player to skip
      $info = $this->ctx->getInfo();
      $this->addElminiateAnimalsState($info['animalIds'], $info['tileId']);
    }
  }

  private function handleEscape($game, $player, $animalId)
  {
    $info = $this->ctx->getInfo();
    $options = $this->getOptions(Animals::getMany($info['animalIds']));
    Stats::setEscapeUsed($player->getId(), 1);

    if ($animalId === null || !isset($options[$animalId])) {
      throw new \feException("ERROR_011");
    }

    $animal = Animals::get($animalId);
    $startingTile = $options[$animalId];

    $animal->moveTo($player, $startingTile, RETURN_TO_STARTING_TILE);

    $actionToken = ActionTokens::getTokenForPlayer(ESCAPE, $player->getId());
    $actionToken->discard($player);

    unset($options[$animalId]);
    $remainingAnimalIds = array_keys($options);
    $game->gamestate->setAllPlayersNonMultiactive('next');

    if (count($remainingAnimalIds) === 0) {
      return;
    }

    $currentTurnPlayerId = $info['currentTurnPlayerId'];
    $playersThatCanStillUseEscapeToken = $this->getPlayersThatCanUseEscapeToken($currentTurnPlayerId);
    // Still animals that can escape and players that can use the escape token
    if (count($playersThatCanStillUseEscapeToken) > 0) {
      $action = [
        'action' => ESCAPE,
        'animalIds' => $remainingAnimalIds,
        'tileId' => $info['tileId'],
        'playerId' => 'some',
        'activePlayerIds' => Utils::returnIds($playersThatCanStillUseEscapeToken),
        'currentTurnPlayerId' => $currentTurnPlayerId,
      ];
      $this->ctx->insertAsBrother(Engine::buildTree($action));
    } else {
      $this->addElminiateAnimalsState($remainingAnimalIds, $info['tileId']);
    }
  }

  public function getOptions($animals)
  {
    $options = [];
    foreach ($animals as $animal) {
      $startingTile = $animal->getStartingTile();
      if ($animal->getLocation() === $startingTile) {
        continue;
      }
      $options[$animal->getId()] = $startingTile;
    }
    return $options;
  }

  public function getPlayersThatCanUseEscapeToken($currentTurnPlayerId)
  {
    // Check if animals can escape
    $actionTokens = ActionTokens::getAll();
    $playersThatCanUseEscapeToken = Utils::filter(Players::getAll()->toArray(), function ($player) use ($currentTurnPlayerId, $actionTokens) {
      if ($player->getId() === $currentTurnPlayerId) {
        return false;
      }
      return $actionTokens[implode('_', [ESCAPE, $player->getId()])]->getLocation() === Locations::actionTokens($player->getId());
    });

    return $playersThatCanUseEscapeToken;
  }
}
