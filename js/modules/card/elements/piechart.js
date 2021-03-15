//PIE CHART ELEMENT FUNCTION

export async function piechart(thiscd, thisElement, thiscn) {
    //get card id
    let cardId = window.page.cards[thiscd].cardId;

    let thisAl = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let thisc = thisAl[thiscn];

    //CREATE A CHART INSIDE THIS CARD
    let crpc = false;
    if (document.getElementById(cardId + "PieChart" + thisc) == null) {
        document.getElementById(cardId + "Body").insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId  + "LineBarChartBody" + thisc + "Container\" " +
            "class=\"card-body text-dark align-items-center align-middle display-flex\" " +
            "style=\"border: 0px solid #343a40; overflow: hidden; " +
            "color: " + window.page.cards[thiscd].layout.body.color + "; " +
            "height: " + window.page.cards[thiscd].layout.body.height + "vh;\">" +
            "<div id=\"" + cardId + "PieChartBody" + thisc + "\" style=\"height:100%; width:100%;\" class=\"chart-container chart-body\">" +
            "<canvas id=\"" + cardId + "PieChart" + thisc + "\" " +
            "style=\" padding-bottom: -1rem;\"></canvas>" +
            "</div></div>");
        crpc = true;
    };

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

    let chart_type = window.page.cards[thiscd].layout.elements[thisElement].type;

    let labelsArray = [];
    let dataArray = [];
    let um = "";

    let dataCount = window.page.cards[thiscd].layout.elements[thisElement].data.length;
    for (let i = 0; i < dataCount; i++) {
        if (chart_type == "piechart") {
            let dataset = window.page.cards[thiscd].layout.elements[thisElement].data[i].dataset;
            let countlimit = window.page.datasets[dataset]["data"].length;
            um = window.page.datasets[dataset].um;
            for (let s = 0; s < countlimit; s++) {
                dataArray[dataArray.length] = window.page.datasets[dataset].data[s][1];
                labelsArray[labelsArray.length] = window.page.datasets[dataset].data[s][0];
            };
            if (window.page.cards[thiscd].layout.elements[thisElement].data[i].colors != null) {
                let colorsLen = window.page.cards[thiscd].layout.elements[thisElement].data[i].colors.length;
                for (let y = 0; y < colorsLen; y++) {
                    colorArray[y] = window.page.cards[thiscd].layout.elements[thisElement].data[i].colors[y];
                };
            };
        };
    };

    if (window.page.cards[thiscd].layout.elements[thisElement].addons.legend == null) {
        window.page.cards[thiscd].layout.elements[thisElement].addons.legend = {};
    };
    let legend;
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display != null) {
        legend = window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display;
    } else {
        if (window.page.cards[thiscd].layout.elements[thisElement].legend.display != null) {
            legend = window.page.cards[thiscd].layout.elements[thisElement].legend.display;
        } else {
            legend = window.page.cards[thiscd].layout.elements[thisElement].legend.display;
        };
    };
    let position;
    if (window.page.cards[thiscd].layout.elements[thisElement].addons.legend.position != null) {
        position = window.page.cards[thiscd].layout.elements[thisElement].addons.legend.position;
    } else {
        if (window.page.cards[thiscd].layout.elements[thisElement].legend.position != null) {
            position = window.page.cards[thiscd].layout.elements[thisElement].legend.position;
        } else {
            position = window.page.cards[thiscd].layout.elements[thisElement].legend.position;
        };
    };

    //Create Chart Function
    async function createChart() {
        let canvas = document.getElementById(cardId + "PieChart" + thisc);
        canvas.style.backgroundColor = window.page.cards[thiscd].layout.body.color;
        let ctx = canvas.getContext("2d");
        // Create Pie Chart
        window.page.cards[thiscd].layout.elements[thisElement].chart = new Chart(ctx, {
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
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let index = ctx.dataIndex;
                            let labelName = ctx.chart.data.labels[index];
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let perc = "(" + (value * 100 / sum).toFixed(1) + "%)";
                            let label = String(value);
                            if (um != "") {
                                if (um == "R$") { label = um + " " + label; };
                                if (um != "R$") { label = label + " " + um; };
                            };
                            let e = "";
                            for (let j = 0; j < (label.length - perc.length); j++) { e += " "; };
                            label = label + "\n" + e + perc;
                            return label;
                        },
                        display: (ctx) => {
                            let index = ctx.dataIndex;
                            let value = ctx.dataset.data[index];
                            if (value == 0) {
                                return false
                            } else {
                                return "auto"
                            };
                        },
                        anchor: (ctx) => {
                            let index = ctx.dataIndex;
                            let value = ctx.dataset.data[index];
                            let dataArr = ctx.chart.data.datasets[0].data;
                            let sum = 0;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let perc = (value * 100 / sum);
                            if (perc <= 10) {
                                return "end"
                            } else {
                                return "center"
                            };
                        },
                        backgroundColor: (ctx) => {
                            let index = ctx.dataIndex;
                            let color = ctx.dataset.backgroundColor[index];
                            return color
                        },
                        clamp: true,
                        color: "white",
                        borderColor: "rgb(255,255,255)",
                        borderWidth: 2,
                        borderRadius: 5,
                        labels: {
                            title: {
                                font: (ctx) => {
                                    let width = ctx.chart.width;
                                    let e = window.page.cards[thiscd].layout.elements[thisElement].data[0].datalabels.font.size;
                                    let size = e * Math.round(width / 80);
                                    return {
                                        weight: "bold",
                                        size: size
                                    };
                                }
                            }
                        }
                    },
                    outlabels: { display: false }
                },
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

        let func = ["togglelegend"];
        let inputsArray = [thiscd, thisElement, thiscn];
        //assign functions to card
        let apply = [thiscd, "piechart", thiscn, func, inputsArray];
        let cdf = await window.page.main.dyn.misc.chartFunctions.apply(null, apply);

        if (window.page.cards[thiscd].layout.elements[thisElement].addons.canvas != null) {
            if (window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.posx != null) {
                if (window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.posy != null) {
                    if (window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.interval != null) {
                        interval = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.interval;
                        clearInterval(interval);
                    };
                    let interval = setInterval(
                        async() => {
                            let posx = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.posx;
                            let posy = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.posy;
                            let fontsize = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.fontsize;
                            let font = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.font;
                            let fillstyle = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.fillstyle;
                            let background = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.background;
                            let _dataset = window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.data;
                            let content = window.page.datasets[_dataset].data;
                            let apply = [canvas, ctx, posx, posy, content, fontsize, font, fillstyle, background];
                            let cd = await window.page.main.dyn.misc.canvasDisplay.apply(null, apply);
                        }, 1
                    );
                    window.page.cards[thiscd].layout.elements[thisElement].addons.canvas.interval = interval;
                };
            };
        };

        return 0;
    };
    if (crpc) {

        let pie = createChart();
        //sets location of the chart
        window.page.cards[thiscd].layout.elements[thisElement].chart.location = cardId + "PieChartBody" + thisc;
    };

    let a = 0;
    for (let da = 0; da < dataArray.length; da++) {
        if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[0].data[da] != dataArray[da]) {
            a += 1;
        };
        if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels[da] != labelsArray[da]) {
            a += 1;
        };
    };
    for (let da = 0; da < labelsArray.length; da++) {
        if (window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels[da] != labelsArray[da]) {
            a += 1;
        };
    };
    if (a > 0) {
        window.page.cards[thiscd].layout.elements[thisElement].chart.data.labels = labelsArray;
        window.page.cards[thiscd].layout.elements[thisElement].chart.data.datasets[0].data = dataArray;
        window.page.cards[thiscd].layout.elements[thisElement].chart.update({ duration: 0 });
    };

    return 0;
}; // End of Exported Function