///<reference path="11_language.ts"/>

run("do(define(plusOne, fun(a, +(a, 1))),",
    "   print(plusOne(10)))");

run("do(define(pow, fun(base, exp,",
    "     if(==(exp, 0),",
    "        1,",
    "        *(base, pow(base, -(exp, 1)))))),",
    "   print(pow(2, 10)))");
    
run("do(define(sum, fun(array,",
"     do(define(i, 0),",
"        define(sum, 0),",
"        while(<(i, length(array)),",
"          do(define(sum, +(sum, element(array, i))),",
"             define(i, +(i, 1)))),",
"        sum))),",
"   print(sum(array(1, 2, 3))))");

run("print(array(1,2,3))");


console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}//pause;

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");
// → Some kind of ReferenceError