import {View, directionNames} from 'environment';
import {IAction} from 'actionTypes';
import {randomElement,charFromElement,dirPlus} from 'utilities';

export interface ICreaturespec {
  energy: number;
  direction: string;
  act(v: View): IAction;
  preySeen?: any[];
  originChar?: string
};

export interface ICreature {
  act: Function,
  energy: number,
  direction: string,
  preySeen: Array<any>
  originChar: string
}

export class Creature implements ICreature {
  public act: Function;
  public energy: number;
  public direction: string;
  public preySeen: Array<any>;

  constructor(public spec: ICreaturespec, public originChar: string) {
    this.act = spec.act;
    this.energy = spec.energy;
    this.direction = spec.direction;
    this.preySeen = spec.preySeen;
  }
};

export function createCreature(legend: Object, ch: string): Creature {
  if (ch == " ") { return null };
  let s: ICreaturespec = creatureSpecs[legend[ch]];
  return new Creature(s, ch)
}

var specs: { [id: string]: ICreaturespec } = {}

specs["Wall"] = {
  energy: null,
  direction: null,
  act: null
};

specs["PlantEater"] = {
  energy: 20,
  direction: "",
  act: (v)=> {
    let space = v.find(" ");
    var plant = v.find("*");

    if (this.energy > 60 && space)
      return { type: "reproduce", direction: space };
    if (plant)
      return { type: "eat", direction: plant };
    if (space)
      return { type: "move", direction: space };
  }
};

specs["WallFollower"] = {
  energy: 20,
  direction: "s",
  act: (v)=> {
    let start = this.direction;
    if (v.look(dirPlus(this.direction, -3)) != null)
      start = this.direction = dirPlus(this.direction, -2);
    while (v.look(this.direction) != null) {
      this.direction = dirPlus(this.direction, 1);
      if (this.direction == start) break;
    }
    return { type: "move", direction: this.direction };
  }
};

specs["BouncingCritter"] = {
  energy: 20,
  direction: randomElement(directionNames),
  act: (v)=> {
    if (v.look(this.direction) != null)
      this.direction = v.find(" ") || "s";
    return { type: "move", direction: this.direction };
  }
}

specs["Plant"] = {
  energy: 3 + Math.random() * 4,
  direction: '',
  act: (v)=> {
    if (this.energy > 15) {
      let space = v.find(" ");
      if (space)
        return { type: "reproduce", direction: space };
    }
    if (this.energy < 20)
      return {type: "grow", direction: null };
  }
}

specs["SmartPlantEater"] = {
  energy: 30,
  direction: "e",
  act: (v)=> {
    let space = v.find(" "); //Never find space???... 
    let plants = v.findAll("*");

    if (this.energy > 90 && space)
      return { type: "reproduce", direction: space };

    if (plants.length > 1)
      return { type: "eat", direction: randomElement(plants) };

    if (v.look(this.direction) != null && space)
      this.direction = space;
    return { type: "move", direction: this.direction };
  }
}

specs["Tiger"] = {
  energy: 100,
  direction: "w",
  preySeen: new Array(0),
  act: (v)=> {
    // Average number of prey seen per turn
    let seenPerTurn: number = this.preySeen.reduce((a, b) => {
      return a + b;
    }, 0) / this.preySeen.length;

    let prey: Creature[] = v.findAll("O");
    let space = v.find(" ");

    this.preySeen.push(prey.length);
    
    // Drop the first element from the array when it is longer than 6
    if (this.preySeen.length > 6)
      this.preySeen.shift();
     
    // Only eat if the predator saw more than ¼ prey animal per turn 
    if (prey.length && seenPerTurn > 0.25)
      return { type: "eat", direction: randomElement(prey) };

    if (this.energy > 400 && space)
      return { type: "reproduce", direction: space };

    if (v.look(this.direction) != null && space)
      this.direction = space;

    return { type: "move", direction: this.direction };
  },
}

export var creatureSpecs = specs;
