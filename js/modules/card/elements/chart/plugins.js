//PIE CHART ELEMENT FUNCTION

export async function plugins(thiscd, thisElement) {

    let cd = {
        get cd() { return window.page.cards[thiscd] },
        get el() { return this.cd.layout.elements[thisElement] }
    };
    let plugins = {
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
                        let e = cd.el.data[0].datalabels.font.size;
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
    }

    return plugins;
}; // End of Exported Function