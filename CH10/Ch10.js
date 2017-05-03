class Monthconverter {
    constructor() {
        this.dates = ["January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October", "November", "December"];
    }
    name(num) {
        try {
            var r = this.dates[num];
            return r;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    number(name) {
        try {
            var r = this.dates.indexOf(name);
            return r;
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
var m = new Monthconverter();
console.log(m.name(2));
// → March
console.log(m.number("November"));
// → 10 
