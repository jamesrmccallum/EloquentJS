//REGULAR EXPRESSIONS
//REGEXP GOLF 

verify(new RegExp('cat|car'), // car and cat 
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(new RegExp('pr?op'), //pop and prop
       ["pop culture", "mad props"],
       ["plop"]);

verify(new RegExp('(ferr)et|y|ari'), //ferret ferry and ferrari
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(new RegExp('ious\\b'),
       ["how delicious", "spacious room"], // any word ending in ious
       ["ruinous", "consciousness"]);

verify(new RegExp('.*\\s[.:;,]'), // a whitespace character followed by a dot, comma, colon or semicolon 
       ["bad punctuation ."],
       ["escape the dot"]);

verify(new RegExp('\\w{7,}'), // a word longer than 6 letters 
       ["hottentottententen"],
       ["no", "hotten totten tenten"]);

verify(new RegExp('\\b[a-df-z]+\\b'), // a word without the letter e 
       ["red platypus", "wobbling nest"],
       ["earth bed", "learning ape"]);


function verify(regexp: RegExp, yes: Array<string>, no: Array<string>) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  yes.forEach(function(s) {
    if (!regexp.test(s))
      console.log("Failure to match '" + s + "'");
  });
  no.forEach(function(s) {
    if (regexp.test(s))
      console.log("Unexpected match for '" + s + "'");
  });
}
//Wait

var text: string = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(new RegExp('\'(?=[A-Z])|(\'\\W|\\W\')|\'$','g'), function(str: string){
  return str.replace("'",'"');
}));
// → "I'm the cook," he said, "it's my job."

//NUMBERS AGAIN 

//Write an expression that matches only JavaScript-style numbers. 
//It must support an optional minus or plus sign in front of the number, 
//the decimal dot, and exponent notation—5e-3 or 1E10— again with an optional sign in front of the exponent. 
//Also note that it is not necessary for there to be digits in front of or after the dot, but the number cannot be a dot alone. 
//That is, .5 and 5. are valid JavaScript numbers, but a lone dot isn’t.

// Fill in this regular expression.
var number: RegExp = /^...$/;

([+-]?\d+) // Get me some positive or negative 
([\.]\d+|\d+[\.]) // Get me some decimals 
((\d*.\d|\d*)?[Ee][+-]?\d+) // get me some exponents 

// Tests:
["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4",
 "1e+12"].forEach(function(s: string) {
  if (!number.test(s))
    console.log("Failed to match '" + s + "'");
});

["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5",
 "."].forEach(function(s: string) {
  if (number.test(s))
    console.log("Incorrectly accepted '" + s + "'");
});
//break