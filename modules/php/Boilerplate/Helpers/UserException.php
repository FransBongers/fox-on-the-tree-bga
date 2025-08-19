<?php
namespace Bga\Games\FoxOnTheTree\Boilerplate\Helpers;
use Bga\Games\FoxOnTheTree\Game;

class UserException extends \BgaUserException
{
  public function __construct($str)
  {
    parent::__construct(Game::get()::translate($str));
  }
}
?>
