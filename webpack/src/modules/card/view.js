
//Show Values Function
export async function render(urlLayout) {

    if (window.page.main.dyn.misc == null) {
        //Define Miscelaneous Object
        window.page.main.dyn.misc = new Object();
        //Resize Fonts Function
        Object.assign(window.page.main.dyn.misc, await window.page.aux.importTree("js/modules/card/functions/canvas-display.js"));
        //Chart Functions
        Object.assign(window.page.main.dyn.misc, await window.page.aux.importTree("js/modules/card/functions/chart-functions.js"));
        //Dropdown Legend Function
        Object.assign(window.page.main.dyn.misc, await window.page.aux.importTree("js/modules/card/functions/dropdown-legend.js"));
        //Resize Fonts Function
        Object.assign(window.page.main.dyn.misc, await window.page.aux.importTree("js/modules/card/functions/resize-fonts.js"));
    };

    //Define Functions
    window.page.main.dyn.show = (window.page.main.dyn.show == null) ? {
        countChanges: async function countChanges(thislayout, datasets, cards, count) {
            datasets = (datasets == null) ? new Array() : datasets;
            let ct = 0;
            let cd = 0;
            if (count != null) { ct = count; };
            if (cards != null) { cd = cards; };
            for (let i = 0; i < thislayout.length; i++) {
                let nextlayout = thislayout[i].content;
                if (nextlayout != null) {
                    //calls itself
                    let cnt = await window.page.main.dyn.show.countChanges(nextlayout, datasets, cd, ct);
                    ct = cnt.changes;
                    cd = cnt.cards;
                } else {
                    if (thislayout[i].type == "card") {
                        cd += 1;
                        let els = thislayout[i].elements;
                        for (let u = 0; u < els.length; u++) {
                            let dat = els[u].data;
                            for (let f = 0; f < dat.length; f++) {
                                if (dat[f].dataset != null) {
                                    if (!datasets.includes(dat[f].dataset)) {
                                        datasets[datasets.length] = dat[f].dataset;
                                    };
                                };
                                if (dat[f].datalabels != null) {
                                    if (!datasets.includes(dat[f].datalabels.dataset)) {
                                        datasets[datasets.length] = dat[f].datalabels.dataset;
                                    };
                                };
                            };
                        };
                        let found = false;
                        for (let a = 0; a < window.page.cards.length; a++) {
                            if (thislayout[i].name === window.page.cards[a].layout.name) {
                                found = true;
                            };
                        };
                        if (!found) {
                            ct += 1;
                        };
                    };
                };
            };
            return {
                changes: ct,
                cards: cd,
                datasets: datasets
            };
        },
        writeLayout: async function writeLayout(thislayout, location, ref) {
            for (let i = 0; i < thislayout.length; i++) {
                let rtrn = await window.page.main.dyn.fillPage(thislayout[i], i, location, ref);
                let nextlayout = thislayout[i].content;
                let nextlocation = document.getElementById(rtrn.id);
                if (nextlayout != null) {
                    //calls itself
                    let rec = await window.page.main.dyn.show.writeLayout(nextlayout, nextlocation, rtrn.ref);
                };
            };
        },
        fillAll: async function fillAll() {
            //reset cards
            window.page.cards = [];
            //get the title of the page
            let containerTitle = document.getElementById("containerTitle").innerHTML;
            //delete all html from container
            document.getElementById("pageContainer").innerHTML = "";
            //create the title of the page
            document.getElementById("pageContainer").insertAdjacentHTML("beforeend",
                "<div class=\"container-title align-items-center text-dark font-weight-bold\" id=\"containerTitle\">" +
                containerTitle + "</div>");
            //run fill page function
            let layout = window.page.layout;
            let location = document.getElementById("pageContainer");
            window.page.main.dyn.show["done"] = true;
            return await window.page.main.dyn.show.writeLayout(layout, location);
        }
    } : window.page.main.dyn.show;

    let timestamp = await window.page.aux.timestamp();
    let urlDatasets = window.page.header.url + "dash/datasets.json?timestamp=" + timestamp;

    //Get Function (getJSON)
    let datasets_index = await window.page.aux.json(urlDatasets);
    let data = await window.page.aux.json(urlLayout);

    //Create Layout Object
    window.page.layout = data.layout;
    //Create Cards Object
    window.page.cards = (window.page.cards == null) ?
        new Array() : window.page.cards;

    let conditions = 0;
    let count = await window.page.main.dyn.show.countChanges(window.page.layout);
    conditions += (count.cards != window.page.cards.length) ? 1 : 0;
    conditions += count.changes;
    let dataset_names = count.datasets;

    let directories = new Array();
    for (let u = 0; u < dataset_names.length; u++) {
        let item = dataset_names[u];
        if (datasets_index[item] != null) {
            if (!directories.includes(datasets_index[item]["dir"])) {
                directories[directories.length] = datasets_index[item]["dir"];
            };
        };
    };

    let datasets = new Object();
    for (let u = 0; u < directories.length; u++) {
        let dir = directories[u];
        let urlData = window.page.header.url + dir + "/data.json?timestamp=" + timestamp;
        let thisDataset = await window.page.aux.json(urlData);
        datasets = Object.assign(datasets, thisDataset);
    };

    if (window.page.datasets != null) {
        for (let item in datasets) {
            let matriz = datasets[item].data;
            if (window.page.datasets[item] != null) {
                let thisdata;
                if (Array.isArray(matriz)) {
                    for (let da = 0; da < matriz.length; da++) {
                        if (Array.isArray(matriz[da])) {
                            for (let dt = 0; dt < matriz[da].length; dt++) {
                                thisdata = window.page.datasets[item].data[da][dt];
                                if (matriz[da][dt] != thisdata) {
                                    conditions += 1;
                                };
                            };
                        } else {
                            thisdata = window.page.datasets[item].data[da];
                            if (matriz[da] != thisdata) {
                                conditions += 1;
                            };
                        };
                    };
                } else {
                    thisdata = window.page.datasets[item].data;
                    if (matriz != thisdata) {
                        conditions += 1;
                    };
                };
            } else {
                conditions += 1;
            };
        };
    } else {
        conditions += 1;
    };

    //Defines the Datasets
    window.page.datasets = datasets;

    let first = false;
    if(window.page.main.dyn.show["done"] == null){
        first = true;
        conditions += 1;
    };

    if (conditions > 0) {
        //Fill All Function
        if (count.cards != window.page.cards.length || count.changes > 0 || first) {
            let fal = await window.page.main.dyn.show.fillAll();
        };
        //Fill Card Function
        for (let i = 0; i < count.cards; i++) {
            let fcd = await window.page.main.dyn.fillCard(i);
        };
    };

    let rsf = await window.page.main.dyn.misc.resizeFonts();

    return 0;

}