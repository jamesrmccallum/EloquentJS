
//RELIABLE MULTIPLICATION 

interface Error { stack: string;}

class MultiplicatorUnitFailure extends Error {
  proto: Error;
  message: string;
  stack: string;
  name: string;

  constructor(message?: string) {
    super()
    this.name = "MultiplicatorUnitFailure";
    this.message = message;
    this.stack = (new Error().stack);
  }
}


function primitiveMultiply(a, b) {
  if (Math.random() < 0.5)
    return a * b;
  else
    throw new MultiplicatorUnitFailure();
}

function reliableMultiply(a, b): number {
  for (; ;) {
    try {
      let result: number = primitiveMultiply(a, b);
      return result;
    } catch (e) {
      if (e instanceof MultiplicatorUnitFailure)
        console.log(e.stack);
        console.warn("bad number.. retrying");
    }
  }
}



console.log(reliableMultiply(8, 8));
// → 64

//THE LOCKED BOX 

class Box {

  constructor(public locked: boolean = true, private _content = []) {
  }

  unlock() { this.locked = false; }
  lock() { this.locked = true; }

  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

var box = new Box();
box.unlock();

function withBoxUnlocked(body: Function) {
  
  //If the box is unlocked we enter and exit without operating on lock 
  //if locked, we unlock and relock it 
  
  var locked: boolean = false;

  try { //Lock test 
    var v: any = box.content;
  } catch (e) {
    locked = true;
    box.unlock();
  }

  try {
    body();
  }
  catch (e) {
    throw e;
  }
  finally {
    if (locked) box.lock();
  }

}

withBoxUnlocked(()=> {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}
console.log(box.locked);
// → true