var MOUNTAINS = [
    { name: "Kilimanjaro", height: 5895, country: "Tanzania" },
    { name: "Everest", height: 8848, country: "Nepal" },
    { name: "Mount Fuji", height: 3776, country: "Japan" },
    { name: "Mont Blanc", height: 4808, country: "Italy/France" },
    { name: "Vaalserberg", height: 323, country: "Netherlands" },
    { name: "Denali", height: 6168, country: "United States" },
    { name: "Popocatepetl", height: 5465, country: "Mexico" }
];

function buildTable(data) {
    var tbl = document.createElement("table");
    var headers = Object.keys(data[0]);
    var th = document.createElement("tr");

    headers.map(function (colname) {
        var p = document.createElement("th");
        p.innerHTML = colname;
        th.appendChild(p);
    });

    tbl.appendChild(th);

    data.map(function (mtn) {
        var r = document.createElement("tr");
        headers.map(function (key) {
            var p = document.createElement("td");
            p.innerHTML = mtn[key];
            r.appendChild(p);
            if (typeof mtn[key] == "number") {
                p.style.textAlign = "right";
            }
            ;
        });
        tbl.appendChild(r);
    });
    return tbl;
}

document.body.appendChild(buildTable(MOUNTAINS));
