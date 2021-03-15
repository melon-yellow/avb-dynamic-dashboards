//BAR CHART ELEMENT FUNCTION 

export async function axes(thiscd, thisElement) {

    let cd = {
        get cd() { return window.page.cards[thiscd] },
        get el() { return this.cd.layout.elements[thisElement] }
    };

    let barOffset = false;
    let max = []; let min = [];

    let time = false;
    if (cd.el.addons.type !== null) {
        if (cd.el.addons.type === "time") {
            time = true;
        };
    };

    let labels_prev = [];
    let datasets = [];
    let countlines = cd.el.data.length;
    for (let i = 0; i < countlines; i++) {

        let thisdisplay;
        if (cd.el.addons.display[i] != null) {
            thisdisplay = cd.el.addons.display[i];
        } else {
            if (cd.el.data[i].display != null) {
                cd.el.addons.display[i] = cd.el.data[i].display;
                thisdisplay = cd.el.addons.display[i];
            } else {
                thisdisplay = true;
            };
        };

        //data and label array
        let dataArray = [];
        let labelsArray = [];

        //get unit of this line
        let dataset = cd.el.data[i].dataset;
        let unit = window.page.datasets[dataset]["um"];

        //sort by timestamp
        if (time) {
            window.page.datasets[dataset]["data"].sort(function(x, y) {
                let xt = moment(x[0], "DD/MM/YYYY HH:mm:ss");
                let yt = moment(y[0], "DD/MM/YYYY HH:mm:ss");
                return xt - yt;
            });
        };
        //create data and label arrays
        let countlimit = window.page.datasets[dataset]["data"].length;
        for (let s = 0; s < countlimit; s++) {
            if (window.page.datasets[dataset]["data"][s][1] !== null) {
                dataArray[s] = Number(window.page.datasets[dataset]["data"][s][1]);
            } else {
                dataArray[s] = null;
            };
            labelsArray[s] = window.page.datasets[dataset]["data"][s][0];
        };
        if (countlimit < 2) {
            dataArray[1] = dataArray[0];
            dataArray[0] = null;
            dataArray[2] = null;
            labelsArray[1] = labelsArray[0];
            labelsArray[0] = "";
            labelsArray[2] = "";
            time = false;
        };
        let maxLength = [];
        for (let s = 0; s < countlimit; s++) {
            maxLength[s] = window.page.datasets[dataset]["data"][s].length;
        };
        maxLength = Math.max.apply(null, maxLength);
        let overlap = [];
        for (let s = 2; s < maxLength; s++) {
            let ss = overlap.length;
            overlap[ss] = [];
            for (let h = 0; h < countlimit; h++) {
                if (window.page.datasets[dataset]["data"][h][s] !== null) {
                    overlap[ss][h] = window.page.datasets[dataset]["data"][h][s];
                };
            };
        };

        for (let s = 0; s < (1 + overlap.length); s++) {

            let ii = datasets.length;

            datasets[ii] = {};
            datasets[ii].label = unit;
            datasets[ii].hidden = !thisdisplay;

            function fixdataarray(da) { let res = [];
                for (let i = 0; i < da.length; i++) {
                    if (da[i] != null) { res.push(da[i]) } };
                return res;
            };
            let dmaxmin = fixdataarray(dataArray);
            max[ii] = Math.max.apply(null, dmaxmin);
            min[ii] = Math.min.apply(null, dmaxmin);

            if (s == 0) {
                datasets[ii].data = dataArray;
            } else {
                datasets[ii].data = overlap[s - 1];
            };

            let datalabels = {
                display: false,
                font: {
                    size: 0
                }
            };


            datasets[ii].datalabels = datalabels;
            labels_prev[ii] = labelsArray;
        };

    };

    //gets max and min
    max = Math.max.apply(null, max);
    min = Math.min.apply(null, min);

    let labels = [];
    for (let t = 0; t < labels_prev.length; t++) {
        for (let o = 0; o < labels_prev.length; o++) {
            if (o != t) {
                let label = [];
                let comp = [];
                for (let v = 0; v < (labels_prev[o].length + labels_prev[t].length); v++) {
                    let matcomp = [];
                    for (let p = 0; p < (labels_prev[o].length + labels_prev[t].length + labels_prev[o].length); p++) {
                        matcomp[p] = [];
                        matcomp[p][0] = null;
                        matcomp[p][1] = null;
                    };
                    for (let p = v; p < (v + labels_prev[o].length); p++) {
                        matcomp[p][0] = labels_prev[o][p - v];
                    };
                    for (let p = labels_prev[o].length; p < (labels_prev[o].length + labels_prev[t].length); p++) {
                        matcomp[p][1] = labels_prev[t][p - labels_prev[o].length];
                    };
                    let start = null;
                    let end = null;
                    let count = 0;
                    let dif = false;
                    for (let p = 0; p < matcomp.length; p++) {
                        let a = (matcomp[p][0] != null);
                        let b = (matcomp[p][1] != null);
                        let c = (matcomp[p][0] == matcomp[p][1]);
                        if (a) {
                            if (b) {
                                if (c) { count += 1; }
                                else { dif = true; };
                            };
                            if (start == null) { start = p; };
                            end = p;
                        } else {
                            if (b) {
                                if (start == null) { start = p; };
                                end = p;
                            };
                        };
                    };
                    if (dif) {
                        start = 0;
                        end = 0;
                        count = 0;
                    };

                    let label = [];
                    for (let p = start; p <= end; p++) {
                        if (matcomp[p][0] == null && matcomp[p][1] != null) {
                            label[label.length] = matcomp[p][1];
                        };
                        if (matcomp[p][0] != null && matcomp[p][1] == null) {
                            label[label.length] = matcomp[p][0];
                        };
                        if (matcomp[p][0] != null && matcomp[p][1] != null) {
                            label[label.length] = matcomp[p][0];
                        };
                    };
                    comp[v] = [count, label];
                };
                let comp_arr = [];
                for (let v = 0; v < comp.length; v++) {
                    comp_arr[v] = comp[v][0];
                };
                let max = Math.max.apply(null, comp_arr);
                if (max > 0) {
                    for (let v = 0; v < comp.length; v++) {
                        if (max == comp[v][0]) {
                            label = comp[v][1];
                        };
                    };
                    labels_prev[t] = label;
                    labels_prev[o] = null;
                };

                let labels_new = [];
                for (let y = 0; y < labels_prev.length; y++) {
                    if (labels_prev[y] != null) {
                        labels_new[labels_new.length] = labels_prev[y];
                    };
                }; labels_prev = labels_new;
            };
        };
    };
    for (let t = 0; t < labels_prev.length; t++) {
        for (let o = 0; o < labels_prev[t].length; o++) {
            if (labels[o] == null) { labels[o] = []; };
            labels[o][t] = labels_prev[t][o];
        };
    };

    function get_maxmin(max, min){
        let prop = max - min;
        if (prop == 0) { prop = 1 };
        max += (prop * 0.1);
        min += (prop * -0.1);
        function get_max(max, n=false){
            let raz = 1;
            if (max < 0) { raz = -1 };
            let max_num = 0;
            while ((max * raz) < 10) { raz *= 10 };
            while ((max * raz) > 100) { raz *= 0.1 };
            let param = [10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100];
            max_num = (()=>{ for (let i = 0; i < param.length; i++) {
                let ie = n ? i - 1 : i; if (ie < 0) { ie = 0 };
                if ((max * raz) < param[i]) { return (param[ie] / raz) }}; return null })();
            return max_num;
        }; return [get_max(max), get_max(min, true)];
    }; let maxmin = get_maxmin(max, min);

    if (cd.el.addons.ticks.y.max == null) {
        cd.el.addons.ticks.y.max = maxmin[0];
    };
    if (cd.el.addons.ticks.y.min == null) {
        cd.el.addons.ticks.y.min = maxmin[1];
    };

    let xAxes = {
        offset: barOffset,
        ticks: cd.el.addons.ticks.x,
        gridLines: {
            drawBorder: false,
            display: cd.el.addons.grid.x,
            color: "rgba(0, 0, 0, .125)"
        },
        stacked: true,
    };
    let yAxes = {
        ticks: cd.el.addons.ticks.y,
        gridLines: {
            drawBorder: false,
            display: cd.el.addons.grid.y,
            color: "rgba(0, 0, 0, .125)"
        },
        stacked: false
    };
    yAxes.ticks.beginAtZero = true;

    if (time) {
        xAxes.type = "time";
        xAxes.time = {
            parser: function parse(e) { return moment(e, "DD/MM/YYYY HH:mm:ss") },
            tooltipFormat: "DD/MM/YYYY HH:mm:ss",
            displayFormats: {
                millisecond: "HH:mm:ss.SSS",
                second: "HH:mm:ss",
                minute: "HH:mm",
                hour: "HH:mm DD MMM",
                day: "DD MMM",
                week: "DD MMM YY",
                month: "MMM YY",
                quarter: "[Q]Q YYYY",
                year: "YYYY"
            }
        };
    };

    return 0;
};