///<reference path = "./all.d.ts" />

import {Vector, IVector} from '../Objects/Objects';
import {Creature, createCreature} from './creatures';
import {world} from './launch'

export interface IAction {
  type: string;
  direction: string;
}

interface IActionFn {
  (c: Creature, v?: Vector, a?: IAction): boolean
}

export var actionTypes: { [id: string]: IActionFn; } = {};
//export var actionTypes = new Map<string,IActionFn>();

actionTypes["grow"] = (critter: Creature) => {
  critter.energy += 0.5;
  return true;
}

actionTypes["move"] = (c, v, a) => {
  let dest: Vector = world.checkDestination(a, v);

  if (dest == null || c.energy <= 1 || world.grid.get(dest) != null)
    return false;

  c.energy -= 1;
  world.grid.set(v, null);
  world.grid.set(dest, c);
  return true;
};

actionTypes["eat"] = (c, v, a) => {
  let dest: Vector = world.checkDestination(a, v);
  var atDest: Creature = dest != null && world.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  c.energy += atDest.energy;
  world.grid.set(dest, null);
  return true;
};

actionTypes["reproduce"] = (c, v, a) => {
  let baby: Creature = createCreature(world.legend, c.originChar);
  let dest: Vector = world.checkDestination(a, v);
  if (dest == null || c.energy <= 2 * baby.energy || world.grid.get(dest) != null)
    return false;
  c.energy -= 2 * baby.energy;
  world.grid.set(dest, baby);
  return true;
};
