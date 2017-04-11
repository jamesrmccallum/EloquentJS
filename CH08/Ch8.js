//RELIABLE MULTIPLICATION 
class MultiplicatorUnitFailure extends Error {
    constructor(message) {
        super();
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
function reliableMultiply(a, b) {
    for (;;) {
        try {
            let result = primitiveMultiply(a, b);
            return result;
        }
        catch (e) {
            if (e instanceof MultiplicatorUnitFailure)
                console.log(e.stack);
            console.log("bad number.. retrying");
        }
    }
}
console.log(reliableMultiply(8, 8));
// → 64
//THE LOCKED BOX 
class Box {
    constructor(locked = true, _content = []) {
        this.locked = locked;
        this._content = _content;
    }
    unlock() { this.locked = false; }
    lock() { this.locked = true; }
    get content() {
        if (this.locked)
            throw new Error("Locked!");
        return this._content;
    }
}
;
var box = new Box();
box.unlock();
function withBoxUnlocked(body) {
    //If the box is unlocked we enter and exit without operating on lock 
    //if locked, we unlock and relock it 
    var locked = false;
    try {
        var v = box.content;
    }
    catch (e) {
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
        if (locked)
            box.lock();
    }
}
withBoxUnlocked(() => {
    box.content.push("gold piece");
});
try {
    withBoxUnlocked(function () {
        throw new Error("Pirates on the horizon! Abort!");
    });
}
catch (e) {
    console.log("Error raised:", e);
}
console.log(box.locked);
// → true 
