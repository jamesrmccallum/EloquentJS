///<reference path="creatures.ts"/>

var actionTypes: { [id: string] : Function; } = {};

actionTypes["grow"] = function(critter: creature) {
  critter.energy += 0.5;
  return true;
  }
  
actionTypes["move"] = function(critter: creature, vector: Vector, action: Action) {
  var dest: Vector = world.checkDestination(action, vector);
  if (dest == null || critter.energy <= 1 ||world.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  world.grid.set(vector, null);
  world.grid.set(dest, critter);
  return true;
};
  
actionTypes["eat"] = function(critter: creature, vector: Vector, action: Action) {
  var dest: Vector = world.checkDestination(action, vector);
  var atDest: creature = dest != null && world.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy;
  world.grid.set(dest, null);
  return true;
};

actionTypes["reproduce"] = function(critter: creature, vector: Vector, action: Action) {
  var baby: creature = createCreature(this.legend, critter.originChar); 
  var dest: Vector = world.checkDestination(action, vector);
  if (dest == null || critter.energy <= 2 * baby.energy || world.grid.get(dest) != null)
      return false;
  critter.energy -= 2 * baby.energy;
  world.grid.set(dest, baby);
  return true;
};
