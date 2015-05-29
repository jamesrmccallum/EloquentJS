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
    
    var handled = action &&
      action.type in actionTypes &&
      actionTypes[action.type].call(this, critter,vector, action);
    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0)
        this.grid.set(vector, null);
    }
  }
  
  //Is the requested direction inside the grid? 
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
        var s: string =  this.grid.get(new Vector(x,y)) == null ? ' ' : this.grid.get(new Vector(x, y)).originChar;
        output += s;
      }
      output += "\n";
    }
    return output;
  }
}

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
  get(vector: Vector): creature {
    var v = this.space[vector.x + this.width * vector.y];
    if (!v) {
      return null;
    } else {
      return v;
    }
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

  look(dir: string): creature {
    var target: Vector = this.vector.plus(directions[dir]);
    if (this,world.grid.isInside(target))
      return this.world.grid.get(target) == null ? null : this.world.grid.get(target);
  }
  
  findAll(ch: string) {
    var found: Array<creature> = [];
    for (var dir in directions) {
      var f: creature = this.look(dir);
      if ((f==null ? ' ': f.originChar) == ch) {
        found.push(dir);
      }
    }
    return found;
  }
  
  find(ch: string) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return utilities.randomElement(found);
  }
}