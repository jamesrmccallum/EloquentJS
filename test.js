function arrayToList(a) {
    var ret = {};
    for (var i = a.length - 1; i > 0; i--) {
        ret = { value: a[i], rest: ret };
    }
    return ret;
}

function listToArray(a) {
    var ret = [];
    for (var node = a; node; node = node.rest) {
        if (node.value !== undefined) {
            ret.push(node.value);
        }
    }
    return ret;
}
;
function prepend(a, rest) {
    var ret = { value: undefined, rest: undefined };
    ret.value = a;
    ret.rest = rest;
    return ret;
}

function deepEqual(obj1, obj2) {
    var chk = true;

    Object.getOwnPropertyNames(obj1).forEach(function (val, idx, ary) {
        if (typeof (obj1[val]) == 'object') {
            if (!deepEqual(obj1[val], obj2[val])) {
                chk = false;
            }
        } else if (obj1[val] !== obj2[val]) {
            chk = false;
        }
    });
    return chk;
}
;

var obj = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj, obj));

// → true
console.log(deepEqual(obj, { here: 1, object: 2 }));

// → false
console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// → true
