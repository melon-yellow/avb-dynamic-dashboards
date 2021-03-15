//BAR CHART ELEMENT FUNCTION

export async function display(thiscd, thisElement, thiscn) {

    //get card id
    let cardId = window.page.cards[thiscd].cardName.replace(/ /gi, "");

    let thisAl = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let thisc = thisAl[thiscn];

    let cardName = window.page.cards[thiscd].cardName;

    //CREATE A CHART INSIDE THIS CARD
    let crdp = false;
    if (document.getElementById(cardId + "Display" + thisc) == null) {

        document.getElementById(cardId + "Header").style.borderBottom = "0";
        document.getElementById(cardId + "Name").style.paddingTop = "0.5rem";
        document.getElementById(cardId + "Header").style.paddingBottom = "0";
        document.getElementById(cardId + "Header").style.marginBottom = "0";
        document.getElementById(cardId + "Body").style.paddingTop = "0";
        document.getElementById(cardId + "Body").style.marginTop = "0";

        document.getElementById(cardId + "Body").insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId  + "LineBarChartBody" + thisc + "Container\" " +
            "class=\"card-body text-dark align-items-center align-middle display-flex\" " +
            "style=\"border: 0px solid #343a40; overflow: hidden; " +
            "color: " + window.page.cards[thiscd].layout.body.color + "; " +
            "height: " + window.page.cards[thiscd].layout.body.height + "vh;\">" +
            "<div id=\"" + cardId + "Display" + thisc + "\" " +
            "class=\"display-container chart-body align-items-center align-middle display-flex\">" +
            "</div>" +
            "</div>");
        crdp = true;

        document.getElementById(cardId + "Display" + thisc).style.paddingTop = "0";
        document.getElementById(cardId + "Display" + thisc).style.marginTop = "0";

    };

    let dataset = window.page.cards[thiscd].layout.elements[thisElement].data[0].dataset;
    let thisdata = window.page.datasets[dataset].data;
    let unit = window.page.datasets[dataset].um;
    let display = "";

    if (typeof thisdata == "number") {
        display = String(thisdata).replace(/,/gi, "");
        display = display.replace(/\./gi, ",")
        display += " " + unit;
    } else {
        display = thisdata;
    };

    if (crdp) {
        document.getElementById(cardId + "Display" + thisc).innerHTML = "" +
            "<div class=\"row no-gutters align-items-center\">" +
            "<div id=\"" + cardId + "ValueDisplay" + "\" class=\"mb-0 font-weight-bold text-gray-800\"></div>" +
            "</div>";
        let displaysize = window.page.cards[thiscd].layout.elements[thisElement].data[0].size;
        document.getElementById(cardId + "ValueDisplay").style.fontSize = String(displaysize) + "vmax";
        document.getElementById(cardId + "ValueDisplay").style.paddingTop = "0";
        document.getElementById(cardId + "ValueDisplay").style.marginTop = "0";
    };

    //assign value to display
    document.getElementById(cardId + "ValueDisplay").innerHTML = display;

    return 0;

}; //End of exported function