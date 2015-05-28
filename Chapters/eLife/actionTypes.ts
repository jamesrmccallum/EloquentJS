
var actionTypes: { [id: string] : Function; } = {};

actionTypes["grow"] = function(critter: creature) {
  critter.energy += 0.5;
  return true;
  }
  
actionTypes["move"] = function(critter: creature, vector: Vector, action) {
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
  }
  
actionTypes["eat"] = function(critter: creature, vector: Vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes["reproduce"] = function(critter: creature, vector: Vector, action) {
  var baby = createCreature(this.legend,critter.originChar); 
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
      return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};
