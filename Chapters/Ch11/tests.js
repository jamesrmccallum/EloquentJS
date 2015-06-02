///<reference path="11_language.ts"/>

run("do(define(plusOne, fun(a, +(a, 1))),", "   print(plusOne(10)))");

run("do(define(pow, fun(base, exp,", "     if(==(exp, 0),", "        1,", "        *(base, pow(base, -(exp, 1)))))),", "   print(pow(2, 10)))");

run("do(define(sum, fun(array,", "     do(define(i, 0),", "        define(sum, 0),", "        while(<(i, length(array)),", "          do(define(sum, +(sum, element(array, i))),", "             define(i, +(i, 1)))),", "        sum))),", "   print(sum(array(1, 2, 3))))");
//pause;
