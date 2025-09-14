<?php

namespace Bga\Games\FoxOnTheTree\Boilerplate\Helpers;

class Locations
{


  public static function actionTokens($playerId)
  {
    return 'actionTokens_' . $playerId;
  }

  public static function hand($playerId)
  {
    return 'hand_' . $playerId;
  }

  public static function points($phase, $number)
  {
    return 'points_' . $phase . '_' . $number;
  }
}
