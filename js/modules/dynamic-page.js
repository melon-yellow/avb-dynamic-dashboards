// Dynamic Page Function
export async function dynamicPage() {

    // Import of Show Values Function
    Object.assign(window.page.main.dyn, await window.page.aux.importTree("js/modules/card/show-values.js"));
    // Fill Page Function
    Object.assign(window.page.main.dyn, await window.page.aux.importTree("js/modules/card/fill-page.js"));
    // Fill Card Function
    Object.assign(window.page.main.dyn, await window.page.aux.importTree("js/modules/card/fill-card.js"));

    // Cyclic Run of Show Values Function
    async function Show() {

        // Get reference json folder
        let timestamp = await window.page.aux.timestamp();
        let urlLayout = window.page.header.dir + "/layout.json?timestamp=" + timestamp;
        let urlRequest = window.page.header.dir + "/main.php?action=update";

        // If first
        let first = (window.page.main.dyn.lastupdate == null);
        if (first) { window.page.main.dyn.lastupdate = 1; };
        // Call for Update
        let update = window.page.aux.json(urlRequest);
        // Define s
        let s = null;
        // Then
        update.then(async() => {
            let up = await update;
            if (up["timestamp"] != window.page.main.dyn.lastupdate) {
                window.page.main.dyn.lastupdate = up["timestamp"];
                s = await window.page.main.dyn.showValues(urlLayout);
            };
        }).catch(async() => { s = -1 });
        // Run first
        s = first ? await window.page.main.dyn.showValues(urlLayout) : null;
        // await update function
        await update;

        return s;
    };

    //First Run
    setTimeout(Show, 0);
    //Cyclic Run (each second)
    setInterval(Show, 1000);

    return 0;

}; //End of Exported Function