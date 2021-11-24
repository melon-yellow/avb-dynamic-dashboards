
export default function fillCard(thiscd) {

    let cardName = window.page.cards[thiscd].cardName;
    let cardId = window.page.cards[thiscd].cardId;
    let location = document.getElementById(cardId);

    //creates card header and title
    if (document.getElementById(cardId + "Name") == null) {
        let hcss = "";
        let bcss = "";
        if (window.page.cards[thiscd].layout.header.css != null) {
            hcss = window.page.cards[thiscd].layout.header.css;
        };
        if (window.page.cards[thiscd].layout.body.css != null) {
            bcss = window.page.cards[thiscd].layout.body.css;
        };
        location.insertAdjacentHTML("beforeend",
            "<div id=\"" + cardId + "Header\" class=\"card-header d-flex " +
            "align-items-center justify-content-between\"" +
            "style=\"border: 2px solid #343a40; border-bottom: 0px; background-color: " + 
            window.page.cards[thiscd].layout.header.color + "; " + hcss + "\">" +
            "<a id=\"" + cardId + "Name" + "\" " +
            "class=\"card-title-sm font-weight-bold\" href=\"" + window.page.href + "\">" + cardName + "</a>" +
            "<div class=\"dropdown\">" +
            "<span id=\"" + cardId + "Button" + "\" class=\"btn btn-link\">" +
            "<i class=\"fas fa-bars\" style=\"color: " + window.page.cards[thiscd].layout.header.font.color + ";\"></i>" +
            "</span>" +
            "<div id=\"" + cardId + "ButtonDropdown" + "\" " +
            "class=\"dropdown-content\" style=\"border: 2px solid #343a40;\">" +
            "</div></div></div>" +
            "<div id=\"" + cardId + "Body\" class=\"card-body align-items-center align-middle\"" +
            "style=\"border: 2px solid #343a40; border-top: 0px; overflow: hidden; " + 
            "padding-left: 10px; padding-right: 10px; padding-bottom: 2.5px; overflow: hidden; " + bcss + "\">" +
            "</div>");

        document.getElementById(cardId + "Name").style.color = window.page.cards[thiscd].layout.header.font.color;
        document.getElementById(cardId + "Name").style.fontSize = String(window.page.cards[thiscd].layout.header.font.size) + "vmax";
    };

    //get the number of elements in the card
    let elementsCount = window.page.cards[thiscd].layout.elements.length;

    let thissel = {
        datatable: 0,
        linebarchart: 0,
        piechart: 0,
        progressbar: 0,
        display: 0
    };

    //Define Elements Object
    window.page.main.dyn.elements = (window.page.main.dyn.elements == null) ?
        new Object() : window.page.main.dyn.elements;

    //for each element
    for (let thisElement = 0; thisElement < elementsCount; thisElement++) {
        //get this element type
        let elementType = window.page.cards[thiscd].layout.elements[thisElement].type;
        //Import Element Modules
        Object.assign(window.page.main.dyn.elements, await window.page.aux.importTree("js/modules/card/elements/" + elementType + ".js"));
        let thiscn = thissel[elementType];
        window.page.cards[thiscd].layout.elements[thisElement].addons.typechart = new Array();
        //Run Element Function
        let sa = await window.page.main.dyn.elements[elementType](thiscd, thisElement, thiscn);
        thissel[elementType] += 1;
    };

    return 0;
}; //End of exported function