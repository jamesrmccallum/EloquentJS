var ANCESTRY_FILE = "[\n  " + [
    '{"name": "Carolus Haverbeke", "sex": "m", "born": 1832, "died": 1905, "father": "Carel Haverbeke", "mother": "Maria van Brussel"}',
    '{"name": "Emma de Milliano", "sex": "f", "born": 1876, "died": 1956, "father": "Petrus de Milliano", "mother": "Sophia van Damme"}',
    '{"name": "Maria de Rycke", "sex": "f", "born": 1683, "died": 1724, "father": "Frederik de Rycke", "mother": "Laurentia van Vlaenderen"}',
    '{"name": "Jan van Brussel", "sex": "m", "born": 1714, "died": 1748, "father": "Jacobus van Brussel", "mother": "Joanna van Rooten"}',
    '{"name": "Philibert Haverbeke", "sex": "m", "born": 1907, "died": 1997, "father": "Emile Haverbeke", "mother": "Emma de Milliano"}',
    '{"name": "Jan Frans van Brussel", "sex": "m", "born": 1761, "died": 1833, "father": "Jacobus Bernardus van Brussel", "mother":null}',
    '{"name": "Pauwels van Haverbeke", "sex": "m", "born": 1535, "died": 1582, "father": "N. van Haverbeke", "mother":null}',
    '{"name": "Clara Aernoudts", "sex": "f", "born": 1918, "died": 2012, "father": "Henry Aernoudts", "mother": "Sidonie Coene"}',
    '{"name": "Emile Haverbeke", "sex": "m", "born": 1877, "died": 1968, "father": "Carolus Haverbeke", "mother": "Maria Sturm"}',
    '{"name": "Lieven de Causmaecker", "sex": "m", "born": 1696, "died": 1724, "father": "Carel de Causmaecker", "mother": "Joanna Claes"}',
    '{"name": "Pieter Haverbeke", "sex": "m", "born": 1602, "died": 1642, "father": "Lieven van Haverbeke", "mother":null}',
    '{"name": "Livina Haverbeke", "sex": "f", "born": 1692, "died": 1743, "father": "Daniel Haverbeke", "mother": "Joanna de Pape"}',
    '{"name": "Pieter Bernard Haverbeke", "sex": "m", "born": 1695, "died": 1762, "father": "Willem Haverbeke", "mother": "Petronella Wauters"}',
    '{"name": "Lieven van Haverbeke", "sex": "m", "born": 1570, "died": 1636, "father": "Pauwels van Haverbeke", "mother": "Lievijne Jans"}',
    '{"name": "Joanna de Causmaecker", "sex": "f", "born": 1762, "died": 1807, "father": "Bernardus de Causmaecker", "mother":null}',
    '{"name": "Willem Haverbeke", "sex": "m", "born": 1668, "died": 1731, "father": "Lieven Haverbeke", "mother": "Elisabeth Hercke"}',
    '{"name": "Pieter Antone Haverbeke", "sex": "m", "born": 1753, "died": 1798, "father": "Jan Francies Haverbeke", "mother": "Petronella de Decker"}',
    '{"name": "Maria van Brussel", "sex": "f", "born": 1801, "died": 1834, "father": "Jan Frans van Brussel", "mother": "Joanna de Causmaecker"}',
    '{"name": "Angela Haverbeke", "sex": "f", "born": 1728, "died": 1734, "father": "Pieter Bernard Haverbeke", "mother": "Livina de Vrieze"}',
    '{"name": "Elisabeth Haverbeke", "sex": "f", "born": 1711, "died": 1754, "father": "Jan Haverbeke", "mother": "Maria de Rycke"}',
    '{"name": "Lievijne Jans", "sex": "f", "born": 1542, "died": 1582, "father":null, "mother":null}',
    '{"name": "Bernardus de Causmaecker", "sex": "m", "born": 1721, "died": 1789, "father": "Lieven de Causmaecker", "mother": "Livina Haverbeke"}',
    '{"name": "Jacoba Lammens", "sex": "f", "born": 1699, "died": 1740, "father": "Lieven Lammens", "mother": "Livina de Vrieze"}',
    '{"name": "Pieter de Decker", "sex": "m", "born": 1705, "died": 1780, "father": "Joos de Decker", "mother": "Petronella van de Steene"}',
    '{"name": "Joanna de Pape", "sex": "f", "born": 1654, "died": 1723, "father": "Vincent de Pape", "mother": "Petronella Wauters"}',
    '{"name": "Daniel Haverbeke", "sex": "m", "born": 1652, "died": 1723, "father": "Lieven Haverbeke", "mother": "Elisabeth Hercke"}',
    '{"name": "Lieven Haverbeke", "sex": "m", "born": 1631, "died": 1676, "father": "Pieter Haverbeke", "mother": "Anna van Hecke"}',
    '{"name": "Martina de Pape", "sex": "f", "born": 1666, "died": 1727, "father": "Vincent de Pape", "mother": "Petronella Wauters"}',
    '{"name": "Jan Francies Haverbeke", "sex": "m", "born": 1725, "died": 1779, "father": "Pieter Bernard Haverbeke", "mother": "Livina de Vrieze"}',
    '{"name": "Maria Haverbeke", "sex": "m", "born": 1905, "died": 1997, "father": "Emile Haverbeke", "mother": "Emma de Milliano"}',
    '{"name": "Petronella de Decker", "sex": "f", "born": 1731, "died": 1781, "father": "Pieter de Decker", "mother": "Livina Haverbeke"}',
    '{"name": "Livina Sierens", "sex": "f", "born": 1761, "died": 1826, "father": "Jan Sierens", "mother": "Maria van Waes"}',
    '{"name": "Laurentia Haverbeke", "sex": "f", "born": 1710, "died": 1786, "father": "Jan Haverbeke", "mother": "Maria de Rycke"}',
    '{"name": "Carel Haverbeke", "sex": "m", "born": 1796, "died": 1837, "father": "Pieter Antone Haverbeke", "mother": "Livina Sierens"}',
    '{"name": "Elisabeth Hercke", "sex": "f", "born": 1632, "died": 1674, "father": "Willem Hercke", "mother": "Margriet de Brabander"}',
    '{"name": "Jan Haverbeke", "sex": "m", "born": 1671, "died": 1731, "father": "Lieven Haverbeke", "mother": "Elisabeth Hercke"}',
    '{"name": "Anna van Hecke", "sex": "f", "born": 1607, "died": 1670, "father": "Paschasius van Hecke", "mother": "Martijntken Beelaert"}',
    '{"name": "Maria Sturm", "sex": "f", "born": 1835, "died": 1917, "father": "Charles Sturm", "mother": "Seraphina Spelier"}',
    '{"name": "Jacobus Bernardus van Brussel", "sex": "m", "born": 1736, "died": 1809, "father": "Jan van Brussel", "mother": "Elisabeth Haverbeke"}'
].join(",\n  ") + "\n]";
;
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
/** Prepend an object argument to the 'tail' of an existing object */
function prepend(a, rest) {
    var ret = { value: a, rest: ret };
    return ret;
}
//OBJECT EQUALITY 
function deepEqual(obj1, obj2) {
    var chk = true;
    Object.getOwnPropertyNames(obj1).forEach((v, i, a) => {
        if (typeof (obj1[v]) == 'object') {
            if (!deepEqual(obj1[v], obj2[v])) {
                chk = false;
            }
        }
        else if (obj1[v] !== obj2[v]) {
            chk = false;
        }
    });
    return chk;
}
;
//FLATTEN AN ARRAY OF ARRAYS
var arrays = [[1, 2, 3], [4, 5], [6]];
function flattener(inArray) {
    return inArray.reduce((a, b) => {
        return a.concat(b);
    });
}
;
console.log(flattener(arrays));
var ancestry = JSON.parse(ANCESTRY_FILE);
;
function averageMotherDaughterAgeDiff(array) {
    var byName = {};
    array.forEach(person => { byName[person.name] = person; });
    var ages = [];
    for (var i = 0; i < array.length; i++) {
        let a = array[i];
        if (a.mother !== "" && a.sex == "f" && byName[a.mother]) {
            let mother = byName[a.mother];
            let age = a.born - mother.born;
            ages.push(age);
        }
    }
    return ages.reduce((a, b) => a + b) / ages.length;
}
;
console.log(averageMotherDaughterAgeDiff(ancestry));
;
;
function lifeExpectancy(array) {
    //Convert an object to an array
    function arrayFromObject(obj) {
        Object.keys(obj).map(key => { return obj[key]; });
        var arr = [];
        var a = {};
        for (var i in obj) {
            var d = { i: obj[i] };
            arr.push(a);
        }
        return arr;
    }
    ;
    function groupBy(list, fn) {
        var groups = {};
        for (var i = 0; i < list.length; i++) {
            var group = JSON.stringify(fn(list[i]));
            if (group in groups) {
                groups[group].push(list[i]);
            }
            else {
                groups[group] = [list[i]];
            }
        }
        return arrayFromObject(groups);
    }
    ;
    var result = groupBy(ancestry, (item) => {
        return [Math.ceil(item.died / 100)];
    });
    // Go through the results array - compute averages, create new array of results
    var ret = [];
    result.forEach((a) => {
        var r = { century: undefined, average: undefined };
        var b = 0;
        r.century = a.century;
        a.ancestors.forEach(x => {
            let p = x.died - x.born;
            b += p;
        });
        r.average = b / a.ancestors.length;
        ret.push(r);
    });
    return ret;
}
console.log(lifeExpectancy(ancestry));
console.log("inspect");
//-------------------------------EVERY AND THEN SOME 
function every(a, f) {
    var res = true;
    a.forEach(a => {
        if (!f(a)) {
            res = false;
        }
    });
    return res;
}
function some(a, f) {
    var res = false;
    var i = 0;
    while (!res && i < a.length) {
        if (f(a[i])) {
            res = true;
        }
        else {
            i++;
        }
    }
    return res;
}
console.log(every([NaN, NaN, NaN], isNaN));
console.log(every([NaN, NaN, 4], isNaN));
console.log(some([NaN, 3, 4], isNaN));
console.log(some([2, 3, 4], isNaN));
console.log("inspect");
