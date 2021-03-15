//BAR CHART ELEMENT FUNCTION

export async function chartFunctions(thiscd, type, thisElement, func, inputsArray) {

    if (Array.isArray(func)) {

        let cardId = window.page.cards[thiscd].cardId;

        for (let i = 0; i < func.length; i++) {

            if (func[i] == "toggleticks") {

                //create toggle ticks function
                async function toggleTicks() {
                    let ticks = window.page.cards[thiscd].layout.elements[thisElement].addons.ticks;
                    if (!ticks.x.display & !ticks.y.display) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.x.display = false;
                        window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.display = true;
                    } else {
                        if (!ticks.x.display & ticks.y.display) {
                            window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.x.display = true;
                            window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.display = false;
                        } else {
                            if (ticks.x.display & !ticks.y.display) {
                                window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.x.display = true;
                                window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.display = true;
                            } else {
                                if (ticks.x.display & ticks.y.display) {
                                    window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.x.display = false;
                                    window.page.cards[thiscd].layout.elements[thisElement].addons.ticks.y.display = false;
                                };
                            };
                        };
                    };
                    ticks = window.page.cards[thiscd].layout.elements[thisElement].addons.ticks;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.options.scales.xAxes[0].ticks.display = ticks.x.display;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.options.scales.yAxes[0].ticks.display = ticks.y.display;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.update();
                };
                //assign function to card
                window.page.cards[thiscd].layout.elements[thisElement].addons.toggleTicks = toggleTicks;

                //create this chart function button
                document.getElementById(cardId + "ButtonDropdown").insertAdjacentHTML("beforeend",
                    "<button class=\"dropdown-item btn btn-link\" " +
                    "onClick=\"window.page.cards[" + thiscd + "].layout.elements[" + thisElement + "].addons.toggleTicks();\">" +
                    "Ticks" + "</button>");
            };

            if (func[i] == "togglegrid") {

                //create toggle grid function
                async function toggleGrid() {
                    let grid = window.page.cards[thiscd].layout.elements[thisElement].addons.grid;
                    if (!grid.x & !grid.y) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.grid.x = false;
                        window.page.cards[thiscd].layout.elements[thisElement].addons.grid.y = true;
                    } else {
                        if (!grid.x & grid.y) {
                            window.page.cards[thiscd].layout.elements[thisElement].addons.grid.x = true;
                            window.page.cards[thiscd].layout.elements[thisElement].addons.grid.y = false;
                        } else {
                            if (grid.x & !grid.y) {
                                window.page.cards[thiscd].layout.elements[thisElement].addons.grid.x = true;
                                window.page.cards[thiscd].layout.elements[thisElement].addons.grid.y = true;
                            } else {
                                if (grid.x & grid.y) {
                                    window.page.cards[thiscd].layout.elements[thisElement].addons.grid.x = false;
                                    window.page.cards[thiscd].layout.elements[thisElement].addons.grid.y = false;
                                };
                            };
                        };
                    };
                    grid = window.page.cards[thiscd].layout.elements[thisElement].addons.grid;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.options.scales.xAxes[0].gridLines.display = grid.x;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.options.scales.yAxes[0].gridLines.display = grid.y;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.update();
                };
                //assign function to card
                window.page.cards[thiscd].layout.elements[thisElement].addons.toggleGrid = toggleGrid;

                //create this chart function button
                document.getElementById(cardId + "ButtonDropdown").insertAdjacentHTML("beforeend",
                    "<button class=\"dropdown-item btn btn-link\" " +
                    "onClick=\"window.page.cards[" + thiscd + "].layout.elements[" + thisElement + "].addons.toggleGrid();\">" +
                    "Grids" + "</button>");
            };

            if (func[i] == "togglelegend") {

                //create toggle legend function
                async function toggleLegend() {
                    let legend = window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display;
                    if (legend) {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display = false;
                    } else {
                        window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display = true;
                    };
                    legend = window.page.cards[thiscd].layout.elements[thisElement].addons.legend.display;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.options.legend.display = legend;
                    window.page.cards[thiscd].layout.elements[thisElement].chart.update();
                };
                //assign function to card
                window.page.cards[thiscd].layout.elements[thisElement].addons.toggleLegend = toggleLegend;

                //create this chart function button
                document.getElementById(cardId + "ButtonDropdown").insertAdjacentHTML("beforeend",
                    "<button class=\"dropdown-item btn btn-link\" " +
                    "onClick=\"window.page.cards[" + thiscd + "].layout.elements[" + thisElement + "].addons.toggleLegend();\">" +
                    "Legend" + "</button>");
            };

            if (func[i] == "changechart") {

                //create change chart function
                async function changeChart(index) {

                    //delete elements
                    async function deleteEl() {
                        if (window.page.cards[thiscd].layout.elements[thisElement] != null) {
                            let delId = window.page.cards[thiscd].layout.elements[thisElement].chart.location;
                            document.getElementById(delId).remove();
                            window.page.cards[thiscd].layout.elements[thisElement].chart = null;
                            document.getElementById(cardId + "ButtonDropdown").innerHTML = "";
                        };
                    };

                    if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[index] == "bar") {
                        let la = await deleteEl(type);
                        window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[index] = "line";
                        let sa = await window.page.main.dyn.elements.linebarchart.apply(null, inputsArray);
                    } else {
                        if (window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[index] == "line") {
                            let la = await deleteEl(type);
                            window.page.cards[thiscd].layout.elements[thisElement].addons.typechart[index] = "bar";
                            let sa = await window.page.main.dyn.elements.linebarchart.apply(null, inputsArray);
                        };
                    };
                };
                //assign function to card
                window.page.cards[thiscd].layout.elements[thisElement].addons.changeChart = changeChart;
            };
        };
    };

    return 0;

}; //End of exported function