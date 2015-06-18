///<reference path="../../Typings/es6-promise.d.ts"/>
/**Wraps XMLHttpGet in a promise */
function get(url, header) {
    return new Promise(function (succeed, fail) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.setRequestHeader("Accept", header);
        req.addEventListener("load", function () {
            if (req.status < 400)
                succeed(req.responseText);
            else
                fail(new Error("Request failed: " + req.statusText));
        });
        req.addEventListener("error", function () {
            fail(new Error("Network error"));
        });
        req.send(null);
    });
}
function all(promises) {
    return new Promise(function (succeed, fail) {
        var results = [];
        var pending = promises.length;
        promises.forEach(function (promise, i) {
            promise.then(function (result) {
                results[i] = result;
                pending -= 1;
                if (pending == 0)
                    succeed(results);
            }, function (error) {
                fail(error);
            });
        });
        if (promises.length == 0)
            succeed(results);
    });
}
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
