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

/**
 * Game state names
 */
const LOG_PHASE = 'LogPhase';
const TAKE_ACTION = 'TakeAction';

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