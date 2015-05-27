var Monthconverter = (function () {
    function Monthconverter() {
        this.dates = [
            "January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October", "November", "December"];
    }
    Monthconverter.prototype.name = function (num) {
        try  {
            var r = this.dates[num];
            return r;
        } catch (e) {
            throw new Error(e);
        }
    };
    Monthconverter.prototype.number = function (name) {
        try  {
            var r = this.dates.indexOf(name);
            return r;
        } catch (e) {
            throw new Error(e);
        }
    };
    return Monthconverter;
})();

var m = new Monthconverter();

console.log(m.name(2));

// → March
console.log(m.number("November"));
// → 10
