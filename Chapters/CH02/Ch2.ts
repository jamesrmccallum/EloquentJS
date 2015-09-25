
/// Looping a triangle

var t: string =''

for (var i =0; i<7; i++){
	t += '#'
	console.log(t);
}

//FIZZBUZZ

for (var i = 0; i<100;i++){
	if(!(i%5 && i%3)) {
		console.log('FizzBuzz');
	} else if (!(i%3)) {
		console.log('Fizz');
	} else if (!(i%5)) {
		console.log('Buzz');
	} else {
		console.log(i);
	}
}

//ChESSBOARD 
var size = 8;

for(var i =0; i<(size * size); i++) {
	if (!(i%size)) {
		console.log('\n');
	} else if (i%2) {
		console.log(' ');
	} else {
		console.log('#')
	}
}