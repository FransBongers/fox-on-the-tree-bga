
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
