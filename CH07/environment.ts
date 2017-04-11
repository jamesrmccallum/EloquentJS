///<reference path = "./all.d.ts" />

import {Vector} from '../Objects/Objects';
import {Creature, createCreature} from './Creatures';
import {IAction, actionTypes} from './actionTypes';
import {randomElement} from './Utilities';

var directions: Object = {
  "n": new Vector(0, -1),
  "ne": new Vector(1, -1),
  "e": new Vector(1, 0),
  "se": new Vector(1, 1),
  "s": new Vector(0, 1),
  "sw": new Vector(-1, 1),
  "w": new Vector(-1, 0),
  "nw": new Vector(-1, -1)
};

export var directionNames: Array<string> = Object.getOwnPropertyNames(directions);

interface ILegend { [symbol: string]: string }

export class World {
  public grid: Grid;

  /** pass a string array for a grid, and a string:string object which defines the character map */
  constructor(map: string[], public legend: ILegend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    
    //Load the grid 
    map.forEach((line: string, y) => {
      for (var x = 0; x < line.length; x++)
        grid.set(new Vector(x, y),
          createCreature(legend, line[x]));
    });
  }
  
  // Let each creature 'act' in turn 
  turn() {
    var acted = [];
    this.grid.forEach((critter: Creature, vector: Vector) => {
      if (critter.act && acted.indexOf(critter) == -1) {
        acted.push(critter);
        this.letAct(critter, vector);
      }
    }, this);
  }

  letAct(critter: Creature, vector: Vector) {

    var at = actionTypes;
    var action: IAction = critter.act(new View(this, vector));

    var handled = action &&
      action.type in at &&
      at[action.type].call(this, critter, vector, action);
    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0)
        this.grid.set(vector, null);
    }
  }
  
  //Is the requested direction inside the grid? 
  checkDestination(action: IAction, vector: Vector) {
    if (directions.hasOwnProperty(action.direction)) {
      var dest = vector.plus(directions[action.direction]);
      if (this.grid.isInside(dest))
        return dest;
    }
  }

  toString() {
    var output: string = "";
    for (var y = 0; y < this.grid.height; y++) {
      for (var x = 0; x < this.grid.width; x++) {
        var s: string = this.grid.get(new Vector(x, y)) == null ? ' ' : this.grid.get(new Vector(x, y)).originChar;
        output += s;
      }
      output += "\n";
    }
    return output;
  }
}

export class Grid {
  public space: Creature[];
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
  }

  isInside(vector: Vector) {
    return vector.x >= 0 && vector.x < this.width &&
      vector.y >= 0 && vector.y < this.height;
  }

  get(vector: Vector): Creature {
    let v = this.space[vector.x + this.width * vector.y];
    if (!v) {
      return null;
    } else {
      return v;
    }
  }
  set(vector: Vector, value: Creature) {
    this.space[vector.x + this.width * vector.y] = value;
  }

  forEach(f: Function, context) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var value = this.space[x + y * this.width];
        if (value != null)
          f.call(context, value, new Vector(x, y));
      }
    }
  }
}

export class View {

  constructor(public world: World, public vector: Vector) {
  }

  look(dir: string): Creature {
    let target: Vector = this.vector.plus(directions[dir]);
    if (this, this.world.grid.isInside(target))
      return this.world.grid.get(target) == null ? null : this.world.grid.get(target);
  }

  findAll(ch: string) {
    let found: Creature[] = [];
    for (let dir in directions) {
      let f: Creature = this.look(dir);
      if ((f == null ? ' ' : f.originChar) == ch) {
        found.push(dir);
      }
    }
    return found;
  }

  find(ch: string) {
    let found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
  }
}
