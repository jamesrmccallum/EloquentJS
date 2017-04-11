// IMPLEMENT A STRETCHCELL INTERFACE
function repeat(str, times) {
    var result = "";
    for (var i = 0; i < times; i++) {
        result += str;
    }
    return result;
}
class TextCell {
    constructor(text) {
        this.text = text.split("\n");
    }
    minWidth() {
        return this.text.reduce((width, line) => Math.max(width, line.length), 0);
    }
    minHeight() {
        return this.text.length;
    }
    draw(width, height) {
        var result = [];
        for (var i = 0; i < height; i++) {
            var line = this.text[i] || "";
            result.push(line + repeat(" ", width - line.length));
        }
        return result;
    }
}
class StretchCell {
    constructor(inner, width, height) {
        this.inner = inner;
        this.width = width;
        this.height = height;
    }
    minWidth() {
        return Math.max(this.inner.minWidth(), this.width);
    }
    minHeight() {
        return Math.max(this.inner.minHeight(), this.height);
    }
    draw(wid, hei) {
        let w = Math.max(this.minWidth(), wid);
        let h = Math.max(this.minHeight(), hei);
        return this.inner.draw(w, h);
    }
}
var sc = new StretchCell(new TextCell("abc"), 1, 2);
console.log(sc.minWidth());
// → 3
console.log(sc.minHeight());
console.log(sc.draw(3, 2));
console.log("test");
class ArraySeq {
    constructor(array, index = 0, end = false) {
        this.array = array;
        this.index = index;
        this.end = end;
    }
    next() {
        // is the current iterator at the end? 
        this.end = this.index == this.array.length;
        if (!this.end) {
            var v = this.array[this.index];
            this.index++;
            return v;
        }
    }
    get atEnd() {
        return this.end;
    }
    get currIndex() {
        return this.index;
    }
}
class RangeSeq {
    constructor(start, end) {
        this.first = start;
        this.last = end;
        this.index = 0;
        this.end = false;
        this.val = start;
    }
    next() {
        if (this.val <= this.last) {
            var v = this.val;
            this.val += 1;
            return v;
        }
        else {
            this.end = true;
        }
    }
    get currIndex() {
        return this.val;
    }
    get atEnd() {
        return this.end;
    }
}
function logFive(seq) {
    for (let i = 0; i < 5; i++) {
        if (!seq.atEnd) {
            console.log(seq.next());
        }
    }
}
console.log("Array Testing");
logFive(new ArraySeq([1, 2]));
logFive(new RangeSeq(100, 1000));
console.log("ok");
