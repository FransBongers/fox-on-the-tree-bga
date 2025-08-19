<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * FoxOnTheTree implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * states.inc.php
 *
 * FoxOnTheTree game states description
 *
 */

use Bga\GameFramework\GameStateBuilder;
use Bga\GameFramework\StateType;

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with `StateType::GAME` type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by 'st' (ex: 'stMyGameStateName').
   _ possibleactions: array that specify possible player actions on this step. It allows you to use `checkAction`
                      method on both client side (Javacript: `this.checkAction`) and server side (PHP: `$this->checkAction`).
                      Note that autowired actions and calls with this.bgaPerformAction call the checkAction except if it's explicitely disabled in the call
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in `nextState` PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on `onEnteringState` or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!


$machinestates = [
    // only keep this line if your initial state is not 2. In that case, uncomment and replace '2' by your first state id.
    // 1 => GameStateBuilder::gameSetup(2)->build(), 

    98 => GameStateBuilder::endScore()->build(),

    // .########.##....##..######...####.##....##.########
    // .##.......###...##.##....##...##..###...##.##......
    // .##.......####..##.##.........##..####..##.##......
    // .######...##.##.##.##...####..##..##.##.##.######..
    // .##.......##..####.##....##...##..##..####.##......
    // .##.......##...###.##....##...##..##...###.##......
    // .########.##....##..######...####.##....##.########


    ST_GENERIC_NEXT_PLAYER => GameStateBuilder::create()
        ->name(GENERIC_NEXT_PLAYER)
        ->description('')
        ->action('stGenericNextPlayer')
        ->type(StateType::GAME)
        ->build(),

    ST_RESOLVE_STACK => GameStateBuilder::create()
        ->name(START_GAME_ENGINE)
        ->description('')
        ->type(StateType::GAME)
        ->action('stResolveStack')
        ->build(),

    ST_CONFIRM_TURN => GameStateBuilder::create()
        ->name(CONFIRM_TURN)
        ->description(clienttranslate('${actplayer} must confirm or restart their turn'))
        ->descriptionmyturn(clienttranslate('${you} must confirm or restart your turn'))
        ->type(StateType::ACTIVE_PLAYER)
        ->args('argsConfirmTurn')
        ->action('stConfirmTurn')
        ->possibleactions([
            // these actions are called from the front with bgaPerformAction, and matched to the function on the game.php file
            'act' . CONFIRM_TURN,
            'actRestart',
            'actUndoToStep',
        ])
        ->build(),

    ST_CONFIRM_PARTIAL_TURN => GameStateBuilder::create()
        ->name(CONFIRM_PARTIAL_TURN)
        ->description(clienttranslate('${actplayer} must confirm the switch of player'))
        ->descriptionmyturn(clienttranslate('${you} must confirm the switch of player. You will not be able to restart turn'))
        ->type(StateType::ACTIVE_PLAYER)
        ->args('argsConfirmTurn')
        ->action('stConfirmTurn')
        ->possibleactions([
            // these actions are called from the front with bgaPerformAction, and matched to the function on the game.php file
            'act' . CONFIRM_PARTIAL_TURN,
            'actRestart',
            'actUndoToStep',
        ])
        ->build(),



    // only keep this line if your initial state is not 2. In that case, uncomment and replace '2' by your first state id.
    // 1 => GameStateBuilder::gameSetup(2)->build(), 

    ST_START_GAME_ENGINE => GameStateBuilder::create()
        ->name(START_GAME_ENGINE)
        ->description('')
        ->type(StateType::GAME)
        ->action('stStartGameEngine')
        ->build(),

    ST_LOG_PHASE => GameStateBuilder::create()
        ->name(LOG_PHASE)
        ->description('')
        ->type(StateType::GAME)
        ->action('stAtomicAction')
        ->build(),

    // ....###....########..#######..##.....##.####..######.
    // ...##.##......##....##.....##.###...###..##..##....##
    // ..##...##.....##....##.....##.####.####..##..##......
    // .##.....##....##....##.....##.##.###.##..##..##......
    // .#########....##....##.....##.##.....##..##..##......
    // .##.....##....##....##.....##.##.....##..##..##....##
    // .##.....##....##.....#######..##.....##.####..######.

    // ....###.....######..########.####..#######..##....##..######.
    // ...##.##...##....##....##.....##..##.....##.###...##.##....##
    // ..##...##..##..........##.....##..##.....##.####..##.##......
    // .##.....##.##..........##.....##..##.....##.##.##.##..######.
    // .#########.##..........##.....##..##.....##.##..####.......##
    // .##.....##.##....##....##.....##..##.....##.##...###.##....##
    // .##.....##..######.....##....####..#######..##....##..######.

    ST_TAKE_ACTION => GameStateBuilder::create()
        ->name(TAKE_ACTION)
        ->description(clienttranslate('${actplayer} must perform an action'))
        ->descriptionmyturn(clienttranslate('${you}'))
        ->type(StateType::ACTIVE_PLAYER)
        ->args('argsAtomicAction')
        ->possibleactions([
            // these actions are called from the front with bgaPerformAction, and matched to the function on the game.php file
            'act' . TAKE_ACTION,
            'actTakeAtomicAction',
            'actRestart',
            'actUndoToStep',
        ])
        ->build(),
];
