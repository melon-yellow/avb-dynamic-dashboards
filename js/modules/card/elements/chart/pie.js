//PIE CHART ELEMENT FUNCTION

import { plugins } from "./plugins";

export async function piechart(thiscd, thisElement, thisc) {

    let cd = {
        get cd() { return window.page.cards[thiscd] },
        get el() { return this.cd.layout.elements[thisElement] }
    };

    let cardId = cd.cd.cardId;


    let chart_type = cd.el.type;

    let labelsArray = [];
    let dataArray = [];
    let um = "";

    let dataCount = cd.el.data.length;
    for (let i = 0; i < dataCount; i++) {
        if (chart_type == "pie") {
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
    };

    if (cd.el.addons.legend == null) {
        cd.el.addons.legend = {};
    };
    let legend;
    if (cd.el.addons.legend.display != null) {
        legend = cd.el.addons.legend.display;
    } else {
        if (cd.el.legend.display != null) {
            legend = cd.el.legend.display;
        } else {
            legend = cd.el.legend.display;
        };
    };
    let position;
    if (cd.el.addons.legend.position != null) {
        position = cd.el.addons.legend.position;
    } else {
        if (cd.el.legend.position != null) {
            position = cd.el.legend.position;
        } else {
            position = cd.el.legend.position;
        };
    };

    //Create Chart Function
    async function createChart() {
        let canvas = document.getElementById(cardId + "Chart" + thisc);
        canvas.style.backgroundColor = cd.cd.layout.body.color;
        let ctx = canvas.getContext("2d");
        // Create Pie Chart
        cd.el.chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labelsArray,
                datasets: [{
                    data: dataArray,
                    backgroundColor: colorArray,
                }],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    position: position,
                    display: legend,
                    labels: {
                        padding: 10,
                        boxWidth: 10
                    }
                },
                plugins: plugins(),
                layout: {
                    padding: {
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 20
                    }
                }
            }
        });
        //construct canvas display
        canvasDisplay(cd, canvas, ctx);

        return 0;
    };
    if (crpc) {

        let pie = createChart();
        //sets location of the chart
        cd.el.chart.location = cardId + "ChartBody" + thisc;
    };

    let a = 0;
    for (let da = 0; da < dataArray.length; da++) {
        if (cd.el.chart.data.datasets[0].data[da] != dataArray[da]) {
            a += 1;
        };
        if (cd.el.chart.data.labels[da] != labelsArray[da]) {
            a += 1;
        };
    };
    for (let da = 0; da < labelsArray.length; da++) {
        if (cd.el.chart.data.labels[da] != labelsArray[da]) {
            a += 1;
        };
    };
    if (a > 0) {
        cd.el.chart.data.labels = labelsArray;
        cd.el.chart.data.datasets[0].data = dataArray;
        cd.el.chart.update({ duration: 0 });
    };

    return 0;
}; // End of Exported Function