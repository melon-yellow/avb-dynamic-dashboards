export async function resizeFonts() {

    function resize() {
        if (window.page == null) { return 0; };
        if (window.page.cards == null) { return 0; };
        let w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        let h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        if (window.page.dim == null) { window.page.dim = {}; };
        if (window.page.dim.width != w || window.page.dim.height != h) { return 0; };
        for (let thiscd = 0; thiscd < window.page.cards.length; thiscd++) {
            if (window.page.cards[thiscd].layout.elements[0].chart != null) {
                window.page.dim.width = w;
                window.page.dim.height = h;
                let vmax = Math.max(w, h);
                let now = {
                    fs: 10 * (vmax / 1000),
                    bw: 10 * (vmax / 1000),
                    dl: 10 * (vmax / 1000),
                };
                window.page.cards[thiscd].layout.elements[0].chart.options.legend.labels.fontSize = now.fs;
                window.page.cards[thiscd].layout.elements[0].chart.options.legend.labels.boxWidth = now.bw;
                if (window.page.cards[thiscd].layout.elements[0].type == "piechart") {
                    window.page.cards[thiscd].layout.elements[0].chart.options.plugins.datalabels.font.size = now.dl;
                } else {
                    for (let f = 0; f < window.page.cards[thiscd].layout.elements[0].chart.data.datasets.length; f++) {
                        window.page.cards[thiscd].layout.elements[0].chart.data.datasets[f].datalabels.font.size = now.dl;
                    };
                };
                window.page.cards[thiscd].layout.elements[0].chart.update({ duration: 0 });
            };
        };
    };
    setInterval(resize, 20);

    return 0;
};