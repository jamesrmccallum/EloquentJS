///<reference path="creatures.ts"/>
///<reference path="actionTypes.ts"/>

interface Action {type: string; direction: string;}

class World {
  public grid: Grid; public legend;
  
  constructor(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;
    
    //Load the grid 
    map.forEach(function(line: string, y) {
      for (var x = 0; x < line.length; x++)
        grid.set(new Vector(x, y),
                 createCreature(legend, line[x]));
    });
  
  }
  
  // Let each creature 'act' in turn 
  turn() {
    var acted = [];
    this.grid.forEach(function(critter: creature, vector: Vector) {
      if (critter.act && acted.indexOf(critter) == -1) {
        acted.push(critter);
        this.letAct(critter, vector);
      }
    }, this);
  }
  
  letAct(critter: creature, vector: Vector) {
    
    var action: Action = critter.act(new View(this, vector));
    
    if (action && action.type == "move") {
      var dest: Vector = this.checkDestination(action, vector);
      if (dest && this.grid.get(dest) == null) {
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
      }
    }
  }
  
  checkDestination(action: Action, vector: Vector) {
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
        var creature = this.grid.get(new Vector(x, y));
        output += creature.originChar || null;
      }
      output += "\n";
    }
    return output;
  }
}

class LifelikeWorld extends World {
  constructor(map, legend) {
    super(map, legend)
  }
  letAct(critter: creature, vector: Vector) {
    var action = critter.act(new View(this, vector));
    var handled = action &&
      action.type in actionTypes &&
      actionTypes[action.type].call(this, critter,vector, action);
    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0)
        this.grid.set(vector, null);
    }
  }

};

class Grid {
  public space: Array<creature>; public width: number; public height: number; 
  
  constructor(width: number, height: number) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
  }
  isInside(vector: Vector) {
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
  }
  get(vector: Vector) {
    return this.space[vector.x + this.width * vector.y];
  }
  set(vector: Vector, value: creature) {
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

class View {
  public world: World; public vector: Vector; 
  
  constructor(world : World, vector: Vector) {
    this.world = world;
    this.vector = vector;
  }

  look(dir: string) {
    var target: Vector = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
      return this.world.grid.get(target).originChar;
    else
      return "#";
  }
  
  findAll(ch) {
    var found: Array<creature> = [];
    for (var dir in directions)
      if (this.look(dir) == ch)
        found.push(dir);
    return found;
  }
  
  find(ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return utilities.randomElement(found);
  }
}