const getGroupPosition = (
  top: number,
  left: number,
  index: number,
  rowSize: number
): AbsolutePosition => {
  const row = Math.floor(index / rowSize);
  const column = index % 4;
  return {
    top: top + 105 * row,
    left: left + 70 * column,
  };
};

/**
 * tile: 200 x 200
 * Animnal: 100 x 107
 */

const ANIMAL_POSITIONS = [
  // 0 on tile
  [],
  // 1 on tile
  [
    {
      top: 46,
      left: 50,
    },
  ],
  // 2 on tile
  [
    {
      top: 46,
      left: 0,
    },
    {
      top: 46,
      left: 100,
    },
  ],
  // 3 on tile
  [
    {
      top: 88,
      left: 0,
    },
    {
      top: 88,
      left: 100,
    },
    {
      top: -29,
      left: 50,
    },
  ],
  // 4 on tile
  [
    {
      top: 88,
      left: 0,
    },
    {
      top: 88,
      left: 100,
    },
    {
      top: -29,
      left: 0,
    },
    {
      top: -29,
      left: 100,
    },
  ],
  // 5 on tile
  [
    {
      top: 88,
      left: 0,
    },
    {
      top: 88,
      left: 100,
    },
    {
      top: -29,
      left: 0,
    },
    {
      top: -29,
      left: 100,
    },
    {
      top: 46,
      left: 50,
    },
  ],
];

const getAnimalPosition = (
  index: number,
  totalOnTile: number
): AbsolutePosition => {
  return ANIMAL_POSITIONS[totalOnTile][index];
};
