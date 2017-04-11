/**Wraps XMLHttpGet in a promise */
function get(url, header) {
    return new Promise((succeed, fail) => {
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
    return new Promise((succeed, fail) => {
        var results = [];
        var pending = promises.length;
        promises.forEach((promise, i) => {
            promise.then((result) => {
                results[i] = result;
                pending -= 1;
                if (pending == 0)
                    succeed(results);
            }, (error) => {
                fail(error);
            });
        });
        if (promises.length == 0)
            succeed(results);
    });
}
