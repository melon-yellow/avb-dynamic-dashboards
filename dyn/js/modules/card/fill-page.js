//Fill Page Function
export async function fillPage(thislayout, i, location, ref) {

    let div = "-";
    if (ref == null) {
        ref = "";
        div = "";
    };

    //get type of layout
    let type = thislayout.type;

    let rtrn = {};

    if (type == "layout") {

        if (thislayout.topnav.color != null) {
            document.getElementById("topNav").style.backgroundColor = thislayout.topnav.color;
            document.getElementsByClassName("sb-sidenav-footer")[0].style.backgroundColor = thislayout.topnav.color;
        };
        if (thislayout.sidenav.color != null) {
            document.getElementsByClassName("sb-sidenav-menu")[0].style.backgroundColor = thislayout.sidenav.color;
            document.getElementById("navBar").style.color = thislayout.sidenav.color;
        };
        if (thislayout.sidenav.display != null) {
            if (thislayout.sidenav.display) {
                if (document.getElementsByClassName("sb-sidenav-toggled").length == 0) {
                    $("body").toggleClass("sb-sidenav-toggled");
                };
            };
        };
        if (thislayout.body.color != null) {
            document.getElementsByTagName("body")[0].style.backgroundColor = thislayout.body.color;
        };
        if (thislayout.body.font.color != null) {
            document.getElementById("containerTitle").style.color = thislayout.body.font.color;
        };
        if (thislayout.body.font.size) {
            document.getElementById("containerTitle").style.fontSize = String(thislayout.body.font.size) + "vmax";
        };

        rtrn.ref = ref;
        rtrn.id = "pageContainer";

    };

    if (type == "row") {

        //set the id of the actual row
        let rowId = "row" + i + div + ref;
        //create row
        location.insertAdjacentHTML("beforeend",
            "<div id=\"" + rowId + "\" class=\"row\">" +
            "</div>");

        rtrn.ref = ref + "r" + i;
        rtrn.id = rowId;

    };

    if (type == "col") {

        let colId = "col" + i + div + ref;
        let colSize = thislayout.grid;
        //create col
        location.insertAdjacentHTML("beforeend",
            "<div id=\"" + colId + "\" class=\"col-xl-" + String(colSize) + " col-md-" + String(colSize) + "\">" +
            "</div>");

        rtrn.ref = ref + "c" + i;
        rtrn.id = colId;

    };

    if (type == "card") {

        let thisc = window.page.cards.length;
        window.page.cards[thisc] = {};
        window.page.cards[thisc].cardName = thislayout.name;
        window.page.cards[thisc].cardId = thislayout.name.replace(/ /gi, "").replace(/~/gi, "#").replace(/-/gi, "#").replace(/\./gi, "#").replace(/:/gi, "#");
        window.page.cards[thisc].layout = thislayout;

        //creates card header and title
        location.insertAdjacentHTML("beforeend",
            "<div id=\"" + window.page.cards[thisc].cardId + "\" " +
            "class=\"card mb-2 shadow card-responsive\" " +
            "style=\"background-color: " + thislayout.body.color + ";\">" +
            "</div>");

        rtrn.ref = ref + "cd" + i;
        rtrn.id = window.page.cards[thisc].cardId;

    };

    return rtrn;
}; //End of Exported Function