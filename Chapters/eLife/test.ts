interface Actin {
    verb: string;
    /* ? */
}

interface Spec<T> {
    name: string;
    act(): T;
}

class Creature<T> {
    constructor(public spec: Spec<T>) {}

    getAction(): T {
        return this.spec.act();
    }
}

var dog = new Creature({
    name: 'dog',
    act() {return <Actin>{ verb: 'woof', bark: 'bark' }}
});

// b: { verb: string, bark: string }
var b = dog.getAction();