//REGULAR EXPRESSIONS
//REGEXP GOLF
verify(new RegExp('cat|car'), ["my car", "bad cats"], ["camper", "high art"]);

verify(new RegExp('pr?op'), ["pop culture", "mad props"], ["plop"]);

verify(new RegExp('(ferr)et|y|ari'), ["ferret", "ferry", "ferrari"], ["ferrum", "transfer A"]);

verify(new RegExp('ious\\b'), ["how delicious", "spacious room"], ["ruinous", "consciousness"]);

verify(new RegExp('.*\\s[.:;,]'), ["bad punctuation ."], ["escape the dot"]);

verify(new RegExp('\\w{7,}'), ["hottentottententen"], ["no", "hotten totten tenten"]);

verify(new RegExp('\\b[a-df-z]+\\b'), ["red platypus", "wobbling nest"], ["earth bed", "learning ape"]);

function verify(regexp, yes, no) {
    // Ignore unfinished exercises
    if (regexp.source == "...")
        return;
    yes.forEach(function (s) {
        if (!regexp.test(s))
            console.log("Failure to match '" + s + "'");
    });
    no.forEach(function (s) {
        if (regexp.test(s))
            console.log("Unexpected match for '" + s + "'");
    });
}

//Wait
var text = "'I'm the cook,' he said, 'it's my job.'";

// Change this call.
console.log(text.replace(new RegExp('\'(?=[A-Z])|(\'\\W|\\W\')|\'$', 'g'), function (str) {
    return str.replace("'", '"');
}));

// → "I'm the cook," he said, "it's my job."
//NUMBERS AGAIN
//Write an expression that matches only JavaScript-style numbers.
//It must support an optional minus or plus sign in front of the number,
//the decimal dot, and exponent notation—5e-3 or 1E10— again with an optional sign in front of the exponent.
//Also note that it is not necessary for there to be digits in front of or after the dot, but the number cannot be a dot alone.
//That is, .5 and 5. are valid JavaScript numbers, but a lone dot isn’t.
// Fill in this regular expression.
var number = new RegExp('[+\-]\?(\\d+(\.\\d*)\?|\.\\d+)\?([eE]\?[+\-]?\\d+)\?');

// Tests:
[
    "1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4",
    "1e+12"].forEach(function (s) {
    if (!number.test(s))
        console.log("Failed to match '" + s + "'");
});

[
    "1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5",
    "."].forEach(function (s) {
    if (number.test(s))
        console.log("Incorrectly accepted '" + s + "'");
});
//break
