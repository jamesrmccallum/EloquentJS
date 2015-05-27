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
