<?php
require_once 'gameoptions.inc.php';

/**
 * Locations
 */
const DECK = 'deck';
const DISCARD = 'discard';
const SUPPLY = 'supply';

/**
 * Game states
 */
const ST_TAKE_ACTION = 4;
const ST_LOG_PHASE = 5;
const ST_USE_ACTION_TOKEN = 6;
const ST_RESOLVE_CONFLICT = 7;
const ST_CHECK_REACH_FINAL_TILE = 8;
const ST_ESCAPE = 9;
const ST_ELIMINATE_ANIMALS = 10;
const ST_END_OF_FIRST_PHASE = 11;
const ST_PRE_END_OF_GAME = 12;

/**
 * Game state names
 */
const LOG_PHASE = 'LogPhase';
const TAKE_ACTION = 'TakeAction';
const USE_ACTION_TOKEN = 'UseActionToken';
const RESOLVE_CONFLICT = 'ResolveConflict';
const CHECK_REACH_FINAL_TILE = 'CheckReachFinalTile';
const ELIMINATE_ANIMALS = 'EliminateAnimals';
const END_OF_FIRST_PHASE = 'EndOfFirstPhase';
const PRE_END_OF_GAME = 'PreEndOfGame';

const BANANA = 'Banana';
const SWAMP = 'Swamp';
const ESCAPE = 'Escape';

const ACTION_TOKENS = [
  BANANA,
  SWAMP,
  ESCAPE,
];

const BEAR = 'Bear';
const CHICKEN = 'Chicken';
const COW = 'Cow';
const FOX = 'Fox';
const GOAT = 'Goat';
const PIG = 'Pig';
const TIGER = 'Tiger';
const WOLF = 'Wolf';

const ANIMALS = [
  BEAR,
  CHICKEN,
  COW,
  FOX,
  GOAT,
  PIG,
  TIGER,
  WOLF,
];

const FARM_ANIMAL = 'FarmAnimal';
const PREDATOR = 'Predator';

const FARM = 'Farm';
const LAIR_OF_PREDATORS = 'LairOfPredators';
const TILE_01 = 'Tile01';
const TILE_02 = 'Tile02';
const TILE_03 = 'Tile03';
const TILE_04 = 'Tile04';
const TILE_05 = 'Tile05';
const TILE_06 = 'Tile06';
const TILE_07 = 'Tile07';
const TILE_08 = 'Tile08';

const TILES = [
  FARM,
  TILE_01,
  TILE_02,
  TILE_03,
  TILE_04,
  TILE_05,
  TILE_06,
  TILE_07,
  TILE_08,
  LAIR_OF_PREDATORS,
];

const PATH_TILES = [
  TILE_01,
  TILE_02,
  TILE_03,
  TILE_04,
  TILE_05,
  TILE_06,
  TILE_07,
  TILE_08,
];

const MOVE = 'move';
const SWAMP_RESCUE = 'swampRescue';

const FIRST_PHASE = 1;
const SECOND_PHASE = 2;
const LEFT = -1;
const RIGHT = 1;

const BASIC = 'basic';
const SPECIAL = 'special';
const RETURN_TO_STARTING_TILE = 'returnToStartingTile';

const FARM_ANIMALS_OUTNUMBER = 'FarmAnimalsOutnumber';
const FARM_ANIMAL_ON_PREVIOUS_TILE = 'FarmAnimalOnPreviousTile';
const PREDATORS_ARE_STRONGER = 'PredatorsAreStronger';

const SET_ASIDE_STANDEES = 'setAsideStandees';