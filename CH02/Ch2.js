/// Looping a triangle
'use strict';
console.log('draw a triangle');
drawTriangle(7);
console.log('fizzbuzz');
fizzBuzz(100);
console.log('chessBoard');
console.log(chessBoard(8));
function drawTriangle(limit) {
    let t = '';
    for (let i = 0; i < limit; i++) {
        t += '#';
        console.log(t);
    }
}
//FIZZBUZZ
function fizzBuzz(limit) {
    for (let i = 0; i < 100; i++) {
        if (!(i % 5 && i % 3)) {
            console.log('FizzBuzz');
        }
        else if (!(i % 3)) {
            console.log('Fizz');
        }
        else if (!(i % 5)) {
            console.log('Buzz');
        }
        else {
            console.log(i);
        }
    }
}
//ChESSBOARD 
function chessBoard(size) {
    let bit = false;
    let ret = '';
    for (let a = 0; a < size; a++) {
        for (let b = 0; b < size; b++) {
            if (bit)
                ret += (a % 2 ? '#' : ' ');
            ret += (a % 2 ? ' ' : '#');
        }
        bit != bit;
    }
    return ret;
}
