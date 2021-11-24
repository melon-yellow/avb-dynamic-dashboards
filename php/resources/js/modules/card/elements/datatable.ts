//TABLE ELEMENT FUNCTION

export async function datatable(thiscd, thisElement, thiscn) {

    //get card id
    let cardId = window.page.cards[thiscd].cardId;

    let thisAl = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let thisc = thisAl[thiscn];

    //CREATE A TABLE INSIDE THIS CARD
    if (document.getElementById(cardId + "DataTable" + thisc) == null) {

        document.getElementById(cardId + "Body").insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId  + "LineBarChartBody" + thisc + "Container\" " +
            "class=\"card-body text-dark align-items-center align-middle display-flex\" " +
            "style=\"border: 0px solid #343a40; overflow: hidden; " +
            "color: " + window.page.cards[thiscd].layout.body.color + "; " +
            "height: " + window.page.cards[thiscd].layout.body.height + "vh;\">" +
            "<table class=\"table table-sm table-bordered small\"" +
            "id=\"" + cardId + "DataTable" + thisc + "\" " +
            "style=\"width:100%; height:100%;\" cellspacing=\"0\">" +
            "</table></div>")
        document.getElementById(cardId + "Body").style.padding = "0px";
        document.getElementById(cardId + "Body").style.borderWidth = "0px";
    };

    async function dataLayout(thislayout, count) {
        let ct = 0;
        if (count != null) { ct = count; };
        for (let i = 0; i < thislayout.length; i++) {
            let nextlayout = thislayout[i].content;
            if (nextlayout != null) {
                ct += await dataLayout(nextlayout, ct);
            } else {
                if (thislayout[i].type == "card") {
                    if (thislayout[i].name === window.page.cards[thiscd].layout.name) {
                        window.page.cards[thiscd].layout = thislayout[i];
                        ct += 1;
                    };
                };
            };
        };
        return ct;
    };
    let dtl = await dataLayout(window.page.layout);

    let table = document.getElementById(cardId + "DataTable" + thisc);
    table.innerHTML = "";

    let dataset = window.page.cards[thiscd].layout.elements[thisElement].data[0].dataset;
    let datatable = window.page.datasets[dataset].data;

    //fill table body
    for (let n = 0; n < datatable.length; n++) {
        //create row
        let row = table.insertRow();
        for (let m = 0; m < datatable[n].length; m++) {
            //create cell
            let cell = row.insertCell();
            //align cell to center
            let att = document.createAttribute("style");
            att.value = "text-align: center; vertical-align: middle; color: dark; border: 2px solid #343a40;";
            if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style != null) {
                if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n] != null) {
                    if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m] != null) {
                        if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].css != null) {
                            att.value += window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].css;
                        };
                        if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].rowspan != null) {
                            cell.rowSpan = window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].rowspan;
                        };
                        if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].colspan != null) {
                            cell.colSpan = window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].colspan;
                        };
                        if (window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].width != null) {
                            cell.width = window.page.cards[thiscd].layout.elements[thisElement].data[0].style[n][m].width;
                        };
                    };
                };
            };
            cell.setAttributeNode(att);
            //assign data to cell
            if (window.page.datasets[dataset].data[n][m] != null) {
                cell.innerHTML = String(window.page.datasets[dataset].data[n][m]);
            } else {
                cell.innerHTML = "--";
            };
        };
    };

    //$(table).DataTable();

    return 0;

}; //End of exported function