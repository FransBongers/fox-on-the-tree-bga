interface AbsolutePosition {
  top: number;
  left: number;
}

const isDebug =
  window.location.host == 'studio.boardgamearena.com' ||
  window.location.hash.indexOf('debug') > -1;
const debug = isDebug ? console.info.bind(window.console) : () => {};

const addCancelButton = (
  props: { callback?: Function; extraClasses?: string } = {}
) => {
  Interaction.use().addCancelButton(props);
};

const addConfirmButton = (callback: Function) => {
  Interaction.use().addConfirmButton(callback);
};

const addDangerActionButton = (props: {
  id: string;
  text: string;
  callback: Function | string;
  extraClasses?: string;
}) => {
  Interaction.use().addDangerActionButton(props);
};

const addPassButton = (optionalAction: boolean, text?: string) =>
  Interaction.use().addPassButton(optionalAction, text);

const addPlayerButton = (props: {
  id: string;
  text: string;
  playerId: number;
  callback: Function | string;
  extraClasses?: string;
}) => Interaction.use().addPlayerButton(props);

const addPrimaryActionButton = (props: {
  id: string;
  text: string;
  callback: Function | string;
  extraClasses?: string;
}) => Interaction.use().addPrimaryActionButton(props);

const addSecondaryActionButton = (props: {
  id: string;
  text: string;
  callback: Function | string;
  extraClasses?: string;
}) => Interaction.use().addSecondaryActionButton(props);

const addUndoButtons = (props: CommonStateArgs) => {
  Interaction.use().addUndoButtons(props);
};

const clearPossible = () => {
  Interaction.use().clearPossible();
};

const updatePageTitle = (
  text: string,
  args: Record<string, string | number | unknown> = {},
  nonActivePlayers: boolean = false
) =>
  Interaction.use().clientUpdatePageTitle(
    text,
    Object.assign(args, { you: '${you}' }),
    nonActivePlayers
  );

const incScore = (playerId: number, value: number) => {
  Interaction.use().game.framework().scoreCtrl[playerId].incValue(value);
};

const formatStringRecursive = (
  log: string,
  args: Record<string, unknown>
): string => {
  return Interaction.use().formatStringRecursive(log, args);
};

const setAbsolutePosition = (
  elt: HTMLElement,
  scaleVarName: string,
  { top, left }: AbsolutePosition
) => {
  // console.log('setAbsolutePosition', elt, top, left);
  if (!elt) {
    return;
  }
  elt.style.top = `calc(var(--${scaleVarName}) * ${top}px)`;
  elt.style.left = `calc(var(--${scaleVarName}) * ${left}px)`;
};

const setCalculatedValue = ({
  elt,
  scaleVarName,
  value,
  property,
}: {
  elt: HTMLElement;
  scaleVarName: string;
  value: number;
  property: 'top' | 'left' | 'width' | 'height';
}) => {
  if (!elt) {
    return;
  }
  elt.style[property] = `calc(var(--${scaleVarName}) * ${value}px)`;
};

const onClick = (
  node: HTMLElement | string,
  callback: Function,
  temporary = true
) => {
  let element = typeof node === 'string' ? document.getElementById(node) : node;
  Interaction.use().onClick(element, callback, temporary);
};

const setSelected = (node: HTMLElement | string) => {
  let element = typeof node === 'string' ? document.getElementById(node) : node;
  Interaction.use().setSelected(element);
};

const performAction = (actionName: string, args: Record<string, unknown>) => {
  Interaction.use().clearPossible();
  Interaction.use().performAction(actionName, args);
};

const getPlayerName = (playerId: number) => {
  return PlayerManager.getInstance().getPlayer(playerId).getName();
};
