<?php

namespace Bga\Games\FoxOnTheTree\Actions;

use Bga\Games\FoxOnTheTree\Boilerplate\Core\Notifications;
use Bga\Games\FoxOnTheTree\Boilerplate\Helpers\Locations;
use Bga\Games\FoxOnTheTree\Managers\ActionTokens;
use Bga\Games\FoxOnTheTree\Models\ActionToken;

class UseActionToken extends \Bga\Games\FoxOnTheTree\Models\AtomicAction
{
  public function getState()
  {
    return ST_USE_ACTION_TOKEN;
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

  public function stUseActionToken()
  {
    // $options = $this->getOptions();

    // if (count($options) === 0) {
    //   $this->resolveAction(['automatic' => true]);
    // }
  }

  // ....###....########...######....######.
  // ...##.##...##.....##.##....##..##....##
  // ..##...##..##.....##.##........##......
  // .##.....##.########..##...####..######.
  // .#########.##...##...##....##........##
  // .##.....##.##....##..##....##..##....##
  // .##.....##.##.....##..######....######.

  public function argsUseActionToken()
  {
    $info = $this->ctx->getInfo();

    $options = $this->getOptions();

    $data = [
      'options' => $options,
      // '_no_notify' => count($options) === 0,
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

  public function actPassUseActionToken()
  {
    $player = self::getPlayer();
    $this->resolveAction(['skip' => true]);
  }

  public function actUseActionToken($args)
  {
    self::checkAction('actUseActionToken');

    $tokenType = $args->tokenType;
    $target = $args->target;
    $skip = $args->skip;


    $player = $this->getPlayer();

    if ($skip) {
      Notifications::message(
        clienttranslate('${player_name} chooses not to use an action token'),
        ['player' => $player]
      );
      $this->resolveAction([]);
      return;
    }

    $options = $this->getOptions();

    if (!array_key_exists($tokenType, $options)) {
      throw new \feException("ERROR_001");
    }

    if (count($options[$tokenType]) === 0) {
      throw new \feException("ERROR_002");
    }

    if (in_array($tokenType, [BANANA, SWAMP]) && !in_array($target, $options[$tokenType])) {
      throw new \feException("ERROR_003");
    }

    if ($tokenType === ESCAPE && !isset($options[$tokenType][$target])) {
      throw new \feException("ERROR_010");
    }


    $token = ActionTokens::getTokenForPlayer($tokenType, $player->getId());

    $token->use($player, $target);

    $this->resolveAction([]);
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  private function getOptions()
  {
    $playerId = $this->ctx->getPlayerId();

    $availableActionsTokens = ActionTokens::getInLocation(Locations::actionTokens($playerId));

    $options = [];

    foreach ($availableActionsTokens as $actionToken) {
      $options[$actionToken->getType()] = $actionToken->getOptions();
    }

    return $options;
  }
}
