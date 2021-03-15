//BAR CHART ELEMENT FUNCTION 

import { types } from "./chart/types";

export async function chart(thiscd, thisElement, thisc) {

    let cd = {
        get cd() { return window.page.cards[thiscd] },
        get el() { return this.cd.layout.elements[thisElement] }
    };

    let cardId = cd.cd.cardId;

    //CREATE A CHART INSIDE THIS CARD
    let crbc = false;
    let height = cd.cd.layout.body.height;
    if (document.getElementById(cardId + "Chart" + thisc) == null) {
        document.getElementById(cardId + "Body").insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId  + "Chart" + thisc + "Container\" " +
            "class=\"card card-responsive card-body align-items-center align-middle\" " +
            "style=\"margin: 0; padding: 0; border: 0px; overflow: hidden; height: " + height + "vh;\">" +
            "<canvas id=\"" + cardId + "Chart" + thisc + "\" style=\"margin: 0; padding: 0;\"></canvas>" +
            "</div>");
        //set crbc true
        crbc = true;
    };

    //data arrays
    if (cd.el.addons.typechart == null) {
        cd.el.addons.typechart = [];
    };

    let barOffset = false;
    cd.el.addons.display = [];
    let max = []; let min = [];

    let time = false;
    if (cd.el.addons.type !== null) {
        if (cd.el.addons.type === "time") {
            time = true;
        };
    };

    let labels_prev = [];

    //fill color array
    let colorArray = [];
    for (let col = 0; col < 100; col++) {
        //add acc
        let acc = 10 * col;
        //fill array
        colorArray[acc + 0] = "#dc3545";
        colorArray[acc + 1] = "#007bff";
        colorArray[acc + 2] = "#28a745";
        colorArray[acc + 3] = "#ffc107";
        colorArray[acc + 4] = "#6f42c1";
        colorArray[acc + 5] = "#e83e8c";
        colorArray[acc + 6] = "#fd7e14";
        colorArray[acc + 7] = "#20c997";
        colorArray[acc + 8] = "#6c757d";
        colorArray[acc + 9] = "#6610f2";
    };

    let datasets = [];
    let countlines = cd.el.data.length;
    for (let i = 0; i < countlines; i++) {

        //get color of this line
        if (cd.el.data[i].color != null) {
            colorArray[i] = cd.el.data[i].color;
        };

        //get this chart type
        let type = cd.el.data[i].type;
        if (cd.el.addons.typechart[i] == null) {
            cd.el.addons.typechart[i] = type;
        };

        //data and label array
        let dataArray = [];
        let labelsArray = [];

        //get unit of this line
        let dataset = cd.el.data[i].dataset;
        let unit = window.page.datasets[dataset]["um"];

        //get type format
        datasets[i] = types(cd, type, dataset, color);

        if (type == "pie") {
            let dataset = cd.el.data[i].dataset;
            let countlimit = window.page.datasets[dataset]["data"].length;
            um = window.page.datasets[dataset].um;
            for (let s = 0; s < countlimit; s++) {
                dataArray[dataArray.length] = window.page.datasets[dataset].data[s][1];
                labelsArray[labelsArray.length] = window.page.datasets[dataset].data[s][0];
            };
            if (cd.el.data[i].colors != null) {
                let colorsLen = cd.el.data[i].colors.length;
                for (let y = 0; y < colorsLen; y++) {
                    colorArray[y] = cd.el.data[i].colors[y];
                };
            };
        };

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

            if (cd.el.addons.typechart[i] == "limit") {
                datasets[ii].backgroundColor = "rgba(0,0,0,0)";
                datasets[ii].type = "line";
                datasets[ii].borderColor = color.replace(")", ", 1)").replace("rgb", "rgba");
                datasets[ii].pointRadius = 0;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBorderColor = "rgba(0,0,0,0)";
                if (cd.el.data[i].dash != null) {
                    let dashLength = cd.el.data[i].dash.dashlength;
                    let space = cd.el.data[i].dash.space;
                    datasets[ii].borderDash = [dashLength, space];
                };
            };

            if (cd.el.addons.typechart[i] == "line") {
                let bkg = cd.el.data[i].background != null;
                if (bkg) { bkg = cd.el.data[i].background }
                else { bkg = color.replace(")", ", 0.2)").replace("rgb", "rgba") };
                datasets[ii].backgroundColor = bkg;
                datasets[ii].type = "line";
                datasets[ii].borderColor = color.replace(")", ", 1)").replace("rgb", "rgba");
                datasets[ii].lineTension = 0.3;
                if (time) { datasets[ii].lineTension = 0; };
                datasets[ii].pointRadius = 3;
                if (time) { datasets[ii].pointRadius = 0; };
                datasets[ii].pointHoverRadius = 4;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
                if (cd.el.data[i].dash != null) {
                    let dashLength = cd.el.data[i].dash.dashlength;
                    let space = cd.el.data[i].dash.space;
                    datasets[ii].borderDash = [dashLength, space];
                };
                if (cd.el.data[i].offset != null){
                    barOffset = cd.el.data[i].offset;
                };
            };

            if (cd.el.addons.typechart[i] == "dispersion") {
                datasets[ii].backgroundColor = color.replace(")", ", 0.3)").replace("rgb", "rgba");
                datasets[ii].type = "line";
                datasets[ii].borderColor = "rgba(0,0,0,0)";
                datasets[ii].lineTension = 0.3;
                if (time) { datasets[ii].lineTension = 0; };
                datasets[ii].pointRadius = 3;
                datasets[ii].pointHoverRadius = 4;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
                if (cd.el.data[i].dash != null) {
                    let dashLength = cd.el.data[i].dash.dashlength;
                    let space = cd.el.data[i].dash.space;
                    datasets[ii].borderDash = [dashLength, space];
                };
            };

            if (cd.el.addons.typechart[i] == "point") {
                datasets[ii].backgroundColor = "rgba(0,0,0,0)";
                datasets[ii].type = "line";
                datasets[ii].borderColor = "rgba(0,0,0,0)";
                datasets[ii].pointRadius = cd.el.data[i].pointradius;
                datasets[ii].pointHoverRadius = cd.el.data[i].pointradius + 1;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
            };

            if (cd.el.addons.typechart[i] == "bar") {
                datasets[ii].backgroundColor = color.replace(")", ", 0.8)").replace("rgb", "rgba");
                datasets[ii].type = "bar";
                datasets[ii].pointRadius = 0;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].barPercentage = 0.75;
                barOffset = true;
            };

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

            if (cd.el.data[i].datalabels != null) {
                if (cd.el.data[i].datalabels.display == true) {

                    datalabels.display = true;
                    datalabels.align = "end";
                    datalabels.anchor = "end";
                    if (cd.el.data[i].datalabels.background != null) {
                        datalabels.backgroundColor = cd.el.data[i].datalabels.background.color;
                    };
                    if (cd.el.data[i].datalabels.border != null) {
                        datalabels.borderColor = cd.el.data[i].datalabels.border.color;
                        datalabels.borderRadius = cd.el.data[i].datalabels.border.radius;
                        datalabels.borderWidth = cd.el.data[i].datalabels.border.width;
                    };
                    if (cd.el.data[i].datalabels.font != null) {
                        datalabels.color = cd.el.data[i].datalabels.font.color;
                        datalabels.font = function(context) {
                            let width = context.chart.width;
                            let e = cd.el.data[i].datalabels.font.size;
                            let size = e * Math.round(width / 80);
                            return {
                                weight: "bold",
                                size: size
                            };
                        };
                    } else {
                        datalabels.color = color;
                        datalabels.font = function(context) {
                            let width = context.chart.width;
                            let size = Math.round(width / 80);
                            return {
                                weight: "bold",
                                size: size
                            };
                        };
                    };
                    datalabels.offset = datasets[ii].pointRadius - 4;
                    datalabels.padding = 4;

                    if (cd.el.data[i].datalabels.dataset != null) {
                        datalabels.formatter = function setDataset(value, context) {
                            let thisIndex = context.dataIndex;
                            let dataset = cd.el.data[i].datalabels.dataset;
                            let column = cd.el.data[i].datalabels.column;
                            return window.page.datasets[dataset]["data"][thisIndex][column];
                        };
                    };
                };
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

    if (cd.el.addons.legend == null) {
        cd.el.addons.legend = {};
        cd.el.addons.legend.display = false;
        cd.el.addons.legend.position = "right";
    };
    if (cd.el.addons.grid == null) {
        cd.el.addons.grid = {};
        cd.el.addons.grid.x = false;
        cd.el.addons.grid.y = false;
    };
    if (cd.el.addons.ticks == null) {
        cd.el.addons.ticks = { x: {}, y: {} };
        cd.el.addons.ticks.x.display = false;
        cd.el.addons.ticks.y.display = false;
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

    let show_title = false;
    let chart_title = "Chart Title"
    if (cd.el.addons.title != null) {
        chart_title = cd.el.addons.title;
        show_title = true;
    };

    //Create Chart Function
    async function createChart() {
        let canvas = document.getElementById(cardId + "Chart" + thisc);
        canvas.style.backgroundColor = cd.cd.layout.body.color;
        let ctx = canvas.getContext("2d");
        //create chart
        cd.el.chart = new Chart(ctx, {
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                title: {
                    display: show_title,
                    position: "right",
                    text: chart_title
                },
                cornerRadius: 10,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [xAxes],
                    yAxes: [yAxes],
                },
                legend: {
                    padding: 10,
                    boxWidth: 10,
                    position: cd.el.addons.legend.position,
                    display: cd.el.addons.legend.display,
                    onHover: async function(e, legendItem) {
                        let ci = this.chart; let inputsArray = [];
                        inputsArray[0] = "window.page.cards[" + thiscd + "].layout.elements[" + thisElement + "].addons.changeChart";
                        let apply = [e, legendItem, ci, ctx, canvas, inputsArray];
                        let dpl = window.page.main.dyn.misc.dropdownLegend.apply(null, apply);
                    }, labels: {}
                }
            }
        });

        let func = ["toggleticks", "togglegrid", "togglelegend", "changechart"];
        let inputsArray = [thiscd, thisElement, thiscn];
        let apply = [thiscd, "linebarchart", thisElement, func, inputsArray, canvas];
        //assign functions to card
        let cdf = await window.page.main.dyn.misc.chartFunctions.apply(null, apply);
        //set the location of the chart
        cd.el.chart.location = cardId + "ChartBody" + thisc;

        return 0;
    };

    if (crbc) {  await createChart(); };

    let a = 0;
    //check for changes in data
    cd.el.addons.animation = {};
    cd.el.addons.animation.change = [];
    let comp = cd.el.chart.data.datasets;
    for (let da = 0; da < datasets.length; da++) {
        for (let dt = 0; dt < datasets[da].data.length; dt++) {
            if (cd.el.chart.data.datasets[da].data[dt] != datasets[da].data[dt]) {
                let changeindex = cd.el.addons.animation.change.length;
                cd.el.addons.animation.change[changeindex] = {};
                let initial = cd.el.chart.data.datasets[da].data[dt];
                let final = datasets[da].data[dt];
                cd.el.addons.animation.change[changeindex].data = [da, dt, initial, final];
                a += 1;
            };
        };
    };
    for (let da = 0; da < comp.length; da++) {
        for (let dt = 0; dt < comp[da].data.length; dt++) {
            if (cd.el.chart.data.datasets[da].data[dt] != datasets[da].data[dt]) {
                a += 1;
            };
        };
    };

    //check for changes in labels
    for (let da = 0; da < labels.length; da++) {
        if (cd.el.chart.data.labels[da] != labels[da]) {
            a += 1;
        };
    };
    let compl = cd.el.chart.data.labels;
    for (let da = 0; da < compl.length; da++) {
        if (cd.el.chart.data.labels[da] != labels[da]) {
            a += 1;
        };
    };

    if (a > 0) { update(thiscd, thisElement); };

    return 0;
};