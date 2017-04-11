///<reference path="./Ch17.ts"/>
// Test code.
all([]).then(function (array) {
    console.log("This should be []:", array);
});
/** Waits random * 500 to return it's argument*/
function soon(val) {
    return new Promise(function (success) {
        setTimeout(function () { success(val); }, Math.random() * 500);
    });
}
all([soon(1), soon(2), soon(3)]).then(function (array) {
    console.log("This should be [1, 2, 3]:", array);
});
/** returns a failing promise */
function fail() {
    return new Promise(function (resolve, reject) {
        reject(new Error("boom"));
    });
}
all([soon(1), fail(), soon(3)]).then(function (array) {
    console.log("We should not get here");
}, function (error) {
    if (error.message != "boom")
        console.log("Unexpected failure:", error);
});
