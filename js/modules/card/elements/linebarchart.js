//BAR CHART ELEMENT FUNCTION

export async function linebarchart(thiscd, thisElement, thiscn) {
    //get card id
    let cardId = window.page.cards[thiscd].cardId;

    let thisAl = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let thisc = thisAl[thiscn];

    //CREATE A CHART INSIDE THIS CARD
    let crbc = false;
    let height = window.page.cards[thiscd].layout.body.height;
    if (document.getElementById(cardId + "LineBarChart" + thisc) == null) {
        document.getElementById(cardId + "Body").insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId  + "LineBarChart" + thisc + "Container\" " +
            "class=\"card card-responsive card-body align-items-center align-middle\" " +
            "style=\"margin: 0; padding: 0; border: 0px; overflow: hidden; height: " + height + "vh;\">" +
            "<canvas id=\"" + cardId + "LineBarChart" + thisc + "\" style=\"margin: 0; padding: 0;\"></canvas>" +
            "</div>");
        //set crbc true
        crbc = true;
    };

    //data arrays
    let datasets = [];
    let countlines = window.page.cards[thiscd].layout.elements[thisElement].data.length;
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.typechart = [];
    };

    let barOffset = false;
    window.page.cards[thiscd].layout.elements[thisElement].addons.display = [];
    let max = []; let min = [];

    let time = false;
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.type !== null) {
        if (window.page.cards[thiscd].layout.elements[thisElement].addons.type === "time") {
            time = true;
        };
    };

    let labels_prev = [];
    for (let i = 0; i < countlines; i++) {

        //get this chart type
        let chart_type = window.page.cards[thiscd].layout.elements[thisElement].data[i].type;
        if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] == null) {
            window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] = chart_type;
        };

        //get color of this line
        let color = window.page.cards[thiscd].layout.elements[thisElement].data[i].color;

        let thisdisplay;
        if (window.page.cards[thiscd].layout.elements[thisElement].addons.display[i] != null) {
            thisdisplay = window.page.cards[thiscd].layout.elements[thisElement].addons.display[i];
        } else {
            if (window.page.cards[thiscd].layout.elements[thisElement].data[i].display != null) {
                window.page.cards[thiscd].layout.elements[thisElement].addons.display[i] = window.page.cards[thiscd].layout.elements[thisElement].data[i].display;
                thisdisplay = window.page.cards[thiscd].layout.elements[thisElement].addons.display[i];
            } else {
                thisdisplay = true;
            };
        };

        //data and label array
        let dataArray = [];
        let labelsArray = [];

        //get unit of this line
        let dataset = window.page.cards[thiscd].layout.elements[thisElement].data[i].dataset;
        let unit = window.page.datasets[dataset]["um"];

        //check if chart type is valid
        let dif_chart = (chart_type != "line");
        dif_chart = (dif_chart && chart_type != "bar");
        dif_chart = (dif_chart && chart_type != "limit");
        dif_chart = (dif_chart && chart_type != "point");
        dif_chart = (dif_chart && chart_type != "dispersion");
        if (dif_chart) { return -1; };

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

            if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] == "limit") {
                datasets[ii].backgroundColor = "rgba(0,0,0,0)";
                datasets[ii].type = "line";
                datasets[ii].borderColor = color.replace(")", ", 1)").replace("rgb", "rgba");
                datasets[ii].pointRadius = 0;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBorderColor = "rgba(0,0,0,0)";
                if (window.page.cards[thiscd].layout.elements[thisElement].data[i].dash != null) {
                    let dashLength = window.page.cards[thiscd].layout.elements[thisElement].data[i].dash.dashlength;
                    let space = window.page.cards[thiscd].layout.elements[thisElement].data[i].dash.space;
                    datasets[ii].borderDash = [dashLength, space];
                };
            };

            if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] == "line") {
                let bkg = window.page.cards[thiscd].layout.elements[thisElement].data[i].background != null;
                if (bkg) { bkg = window.page.cards[thiscd].layout.elements[thisElement].data[i].background }
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
                if (window.page.cards[thiscd].layout.elements[thisElement].data[i].dash != null) {
                    let dashLength = window.page.cards[thiscd].layout.elements[thisElement].data[i].dash.dashlength;
                    let space = window.page.cards[thiscd].layout.elements[thisElement].data[i].dash.space;
                    datasets[ii].borderDash = [dashLength, space];
                };
                if (window.page.cards[thiscd].layout.elements[thisElement].data[i].offset != null){
                    barOffset = window.page.cards[thiscd].layout.elements[thisElement].data[i].offset;
                };
            };

            if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] == "dispersion") {
                datasets[ii].backgroundColor = color.replace(")", ", 0.3)").replace("rgb", "rgba");
                datasets[ii].type = "line";
                datasets[ii].borderColor = "rgba(0,0,0,0)";
                datasets[ii].lineTension = 0.3;
                if (time) { datasets[ii].lineTension = 0; };
                datasets[ii].pointRadius = 3;
                datasets[ii].pointHoverRadius = 4;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
                if (window.page.cards[thiscd].layout.elements[thisElement].data[i].dash != null) {
                    let dashLength = window.page.cards[thiscd].layout.elements[thisElement].data[i].dash.dashlength;
                    let space = window.page.cards[thiscd].layout.elements[thisElement].data[i].dash.space;
                    datasets[ii].borderDash = [dashLength, space];
                };
            };

            if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] == "point") {
                datasets[ii].backgroundColor = "rgba(0,0,0,0)";
                datasets[ii].type = "line";
                datasets[ii].borderColor = "rgba(0,0,0,0)";
                datasets[ii].pointRadius = window.page.cards[thiscd].layout.elements[thisElement].data[i].pointradius;
                datasets[ii].pointHoverRadius = window.page.cards[thiscd].layout.elements[thisElement].data[i].pointradius + 1;
                datasets[ii].pointHitRadius = 20;
                datasets[ii].pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
            };

            if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[i] == "bar") {
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

            if (window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels != null) {
                if (window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.display == true) {

                    datalabels.display = true;
                    datalabels.align = "end";
                    datalabels.anchor = "end";
                    if (window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.background != null) {
                        datalabels.backgroundColor = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.background.color;
                    };
                    if (window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.border != null) {
                        datalabels.borderColor = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.border.color;
                        datalabels.borderRadius = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.border.radius;
                        datalabels.borderWidth = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.border.width;
                    };
                    if (window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.font != null) {
                        datalabels.color = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.font.color;
                        datalabels.font = function(context) {
                            let width = context.chart.width;
                            let e = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.font.size;
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

                    if (window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.dataset != null) {
                        datalabels.formatter = function setDataset(value, context) {
                            let thisIndex = context.dataIndex;
                            let dataset = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.dataset;
                            let column = window.page.cards[thiscd].layout.elements[thisElement].data[i].datalabels.column;
                            let datafixed = null;
                            if (window.page.datasets[dataset]["data"].length == 1) {
                                datafixed = [[null, null], window.page.datasets[dataset]["data"][0], [null, null]];
                            } else { datafixed = window.page.datasets[dataset]["data"] };
                            return datafixed[thisIndex][column];
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

    if (window.page.cards[thiscd].layout.elements[thisElement].addons.legend == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.legend = {};
        window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display = false;
        window.page.cards[thiscd].layout.elements[thisElement].addons.legend.position = "right";
    };
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.grid == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.grid = {};
        window.page.cards[thiscd].layout.elements[thisElement].addons.grid.x = false;
        window.page.cards[thiscd].layout.elements[thisElement].addons.grid.y = false;
    };
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.ticks == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks = { x: {}, y: {} };
        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.x.display = false;
        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.display = false;
    };

    function get_maxmin(max, min) {
        let prop = max - min;
        if (prop == 0) { prop = 1 };
        max += (prop * 0.2);
        min += (prop * -0.2);
        function get_max(max, n=false){
            let raz = 1;
            if (max < 0) { raz = -1 };
            let max_num = 0;
            while ((max * raz) < 10) { raz *= 10 };
            while ((max * raz) > 100) { raz *= 0.1 };
            let param = [10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100];
            max_num = (()=>{ 
                for (let i = 0; i < param.length; i++) {
                    let ie = n ? i - 1 : i;
                    if (ie < 0) ie = 0;
                    if ((max * raz) < param[i]) return (param[ie] / raz);
                }; 
                return null;
            })();
            return max_num;
        }; 
        return [get_max(max), get_max(min, true)];
    };
    let maxmin = get_maxmin(max, min);

    if (window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.max == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.max = maxmin[0];
    };
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.min == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.min = maxmin[1];
    };

    let xAxes = {
        offset: barOffset,
        ticks: window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.x,
        gridLines: {
            drawBorder: false,
            display: window.page.cards[thiscd].layout.elements[thisElement].addons.grid.x,
            color: "rgba(0, 0, 0, .125)"
        },
        stacked: true,
    };
    let yAxes = {
        ticks: window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y,
        gridLines: {
            drawBorder: false,
            display: window.page.cards[thiscd].layout.elements[thisElement].addons.grid.y,
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
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.title != null) {
        chart_title = window.page.cards[thiscd].layout.elements[thisElement].addons.title;
        show_title = true;
    };

    //Create Chart Function
    async function createChart() {
        let canvas = document.getElementById(cardId + "LineBarChart" + thisc);
        canvas.style.backgroundColor = window.page.cards[thiscd].layout.body.color;
        let ctx = canvas.getContext("2d");
        //create chart
        window.page.cards[thiscd].layout.elements[thisElement].chart = new Chart(ctx, {
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                title: {
                    display: show_title,
                    position: "left",
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
                    position: window.page.cards[thiscd].layout.elements[thisElement].addons.legend.position,
                    display: window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display,
                    onHover: async function(e, legendItem) {
                        let ci = this.chart;
                        let inputsArray = [];
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
        window.page.cards[thiscd].layout.elements[thisElement].chart.location = cardId + "LineBarChartBody" + thisc;

        return 0;
    };

    if (crbc) {
        //create chart
        let as = await createChart();
    };

    let a = 0;
    //check for changes in data
    window.page.cards[thiscd].layout.elements[thisElement].addons.animation = {};
    window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change = [];
    let comp = window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets;
    for (let da = 0; da < datasets.length; da++) {
        for (let dt = 0; dt < datasets[da].data.length; dt++) {
            if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[da].data[dt] != datasets[da].data[dt]) {
                let changeindex = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change.length;
                window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[changeindex] = {};
                let initial = window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[da].data[dt];
                let final = datasets[da].data[dt];
                window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[changeindex].data = [da, dt, initial, final];
                a += 1;
            };
        };
    };
    for (let da = 0; da < comp.length; da++) {
        for (let dt = 0; dt < comp[da].data.length; dt++) {
            if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[da].data[dt] != datasets[da].data[dt]) {
                a += 1;
            };
        };
    };

    //check for changes in labels
    for (let da = 0; da < labels.length; da++) {
        if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels[da] != labels[da]) {
            a += 1;
        };
    };
    let compl = window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels;
    for (let da = 0; da < compl.length; da++) {
        if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels[da] != labels[da]) {
            a += 1;
        };
    };

    if (a > 0) {

        window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels = labels;
        window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets = datasets;

        if (window.page.cards[thiscd].layout.elements[thisElement].update != null) {

            if (window.page.cards[thiscd].layout.elements[thisElement].update.type == "individual") {

                let duration = 1000;
                //get duration of animation
                if (window.page.cards[thiscd].layout.elements[thisElement].update.duration != null) {
                    duration = window.page.cards[thiscd].layout.elements[thisElement].update.duration;
                };
                let frames = Math.floor(duration / 20);
                window.page.cards[thiscd].layout.elements[thisElement].addons.animation.frame = 0;

                //set start and end
                let countchange = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change.length;
                for (let i = 0; i < countchange; i++) {
                    let da = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].data[0];
                    let dt = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].data[1];
                    let initial = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].data[2];
                    let final = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].data[3];
                    window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position = [];
                    if (initial == null) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[0] = 0;
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[1] = 0;
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[2] = Number(final);
                    } else {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[0] = Number(initial);
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[1] = Number(initial);
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[2] = Number(final);
                    };
                    //do calc
                    window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].calc = {};
                    let ini = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[0];
                    let p = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[1];
                    let end = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[2];
                    let prop = end - ini;
                    let integral = ((Math.PI) / 4);
                    let unit = ((prop / integral) / frames);
                    //assign value to variables
                    window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].calc.prop = prop;
                    window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].calc.unit = unit;

                };

                //assign interval to animation
                let interval;
                if (duration > 0) {
                    interval = setInterval(animate, 20);
                } else {
                    window.page.cards[thiscd].layout.elements[thisElement].chart.update({ duration: 0 });
                };

                //animate function
                function animate() {

                    if (window.page.cards[thiscd].layout.elements[thisElement].addons.animation == null) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation = {};
                        clearInterval(interval);
                        return 0;
                    };
                    if (window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change == null) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation = {};
                        clearInterval(interval);
                        return 0;
                    };

                    let countchanges = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change.length;
                    let s = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.frame;
                    let v = (1 / frames) * s;
                    let speed = Math.sqrt(1 - (v * v));

                    //for each index changed
                    for (let i = 0; i < countchanges; i++) {

                        let ini = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[0];
                        let p = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[1];
                        let end = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[2];
                        let unit = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].calc.unit;
                        let add = unit * speed;
                        let newpos = p + add;
                        if (end > ini) { if (newpos > end) { newpos = end; }; } else { if (newpos < end) { newpos = end; }; };

                        //assign new positon to data
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].position[1] = newpos;
                        let da = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].data[0];
                        let dt = window.page.cards[thiscd].layout.elements[thisElement].addons.animation.change[i].data[1];

                        //check if this is the last frame
                        if (s < frames) {
                            window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[da].data[dt] = newpos;
                        } else {
                            window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[da].data[dt] = end;
                        };

                    };

                    //update
                    window.page.cards[thiscd].layout.elements[thisElement].chart.update({ duration: 0 });

                    //if this is the last frame
                    if (s >= frames) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation = {};
                        clearInterval(interval);
                    } else {
                        //add next frame
                        window.page.cards[thiscd].layout.elements[thisElement].addons.animation.frame += 1;
                    };

                };

            };

            if (window.page.cards[thiscd].layout.elements[thisElement].update.type == "default") {

                let duration = 1000;
                //get duration of animation
                if (window.page.cards[thiscd].layout.elements[thisElement].update.duration != null) {
                    duration = window.page.cards[thiscd].layout.elements[thisElement].update.duration;
                };
                //update
                window.page.cards[thiscd].layout.elements[thisElement].chart.update({ duration: duration });

            };

        } else {
            //update
            window.page.cards[thiscd].layout.elements[thisElement].chart.update({ duration: 0 });
        };

    };

    return 0;
};