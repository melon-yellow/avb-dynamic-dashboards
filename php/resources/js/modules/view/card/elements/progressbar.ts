//BAR CHART ELEMENT FUNCTION

export async function progressbar(thiscd, thisElement, thiscn) {

    //get card id
    let cardId = window.page.cards[thiscd].cardId;

    let thisAl = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let thisc = thisAl[thiscn];

    //CREATE A CHART INSIDE THIS CARD
    let crpb = false;
    if (document.getElementById(cardId + "ProgressBar" + thisc) == null) {

        let thisheight = window.page.cards[thiscd].layout.elements[thisElement].height;
        document.getElementById(cardId + "Body").insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId + "ProgressBar" + thisc + "\" class=\" chart-container chart-body\">" +
            "</div>");
        crpb = true;
    };

    //clear html
    document.getElementById(cardId + "ProgressBar" + thisc).innerHTML = "";

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
    let max = [];
    let min = [];
    let css = [];

    let dataCount = window.page.cards[thiscd].layout.elements[thisElement].data.length;
    for (let i = 0; i < dataCount; i++) {
        if (chart_type == "progressbar") {
            let dataset = window.page.cards[thiscd].layout.elements[thisElement].data[i].dataset;
            let countlimit = window.page.datasets[dataset]["data"].length;
            for (let s = 0; s < countlimit; s++) {
                css[s] = "";
                labelsArray[labelsArray.length] = window.page.datasets[dataset].data[s][0];
                dataArray[dataArray.length] = window.page.datasets[dataset].data[s][1];
                min[min.length] = window.page.datasets[dataset].data[s][2];
                max[max.length] = window.page.datasets[dataset].data[s][3];
                if (window.page.cards[thiscd].layout.elements[thisElement].data[i].style != null) {
                    if (window.page.cards[thiscd].layout.elements[thisElement].data[i].style.css != null) {
                        css[s] = window.page.cards[thiscd].layout.elements[thisElement].data[i].style.css[s];
                    };
                };
            };
        };
    };

    let res = "";
    for (let i = 0; i < dataArray.length; i++) {
        let perc = String((100 * ((dataArray[i] - min[i]) / (max[i] - min[i]))).toFixed(1));
        res += "" +
            "<h4 class=\"small font-weight-bold\">" + labelsArray[i] +
            "<span class=\"float-right\">" + perc + "%</span></h4>" +
            "<div class=\"progress mb-3\">" +
            "<div class=\"progress-bar\" role=\"progressbar\" " +
            "style=\"width: " + perc + "%; " + css[i] + "\" aria-valuenow=\"" + dataArray[i] + "\" " +
            "aria-valuemin=\"" + min[i] + "\" aria-valuemax=\"" + max[i] + "\"></div>" +
            "</div>";
    };

    //assign value to html
    document.getElementById(cardId + "ProgressBar" + thisc).innerHTML = res;

    return 0;

}; //End of exported function