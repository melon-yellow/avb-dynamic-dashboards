

export async function types(cd, type, dataset, color) {

    //check if chart type is valid
    let valid = false;
    valid = (valid || type == "pie");
    valid = (valid || type == "bar");
    valid = (valid || type == "line");
    valid = (valid || type == "area");
    valid = (valid || type == "point");
    valid = (valid || type == "samples");

    if (!valid) { type = "bar"; };

    if (cd.el.addons.typechart[i] == "bar") {
        dataset.backgroundColor = color.replace(")", ", 0.8)").replace("rgb", "rgba");
        dataset.type = "bar";
        dataset.pointRadius = 0;
        dataset.pointHitRadius = 20;
        dataset.barPercentage = 0.75;
        barOffset = true;
    };

    if (cd.el.addons.typechart[i] == "line") {
        dataset.backgroundColor = "rgba(0,0,0,0)";
        dataset.type = "line";
        dataset.borderColor = color.replace(")", ", 1)").replace("rgb", "rgba");
        dataset.lineTension = 0.3;
        dataset.pointRadius = 3;
        if (time) { 
            dataset.lineTension = 0;
            dataset.pointRadius = 0;
        };
        dataset.pointHoverRadius = 4;
        dataset.pointHitRadius = 20;
        dataset.pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
        if (cd.el.data[i].dash != null) {
            let dashLength = cd.el.data[i].dash.dashlength;
            let space = cd.el.data[i].dash.space;
            dataset.borderDash = [dashLength, space];
        };
        if (cd.el.data[i].offset != null){
            barOffset = cd.el.data[i].offset;
        };
    };

    if (cd.el.addons.typechart[i] == "area") {
        let bkg = cd.el.data[i].background != null;
        if (bkg) { bkg = cd.el.data[i].background }
        else { bkg = color.replace(")", ", 0.2)").replace("rgb", "rgba") };
        dataset.backgroundColor = bkg;
        dataset.type = "line";
        dataset.borderColor = color.replace(")", ", 1)").replace("rgb", "rgba");
        dataset.lineTension = 0.3;
        dataset.pointRadius = 3;
        if (time) { 
            dataset.lineTension = 0;
            dataset.pointRadius = 0;
        };
        dataset.pointHoverRadius = 4;
        dataset.pointHitRadius = 20;
        dataset.pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
        if (cd.el.data[i].dash != null) {
            let dashLength = cd.el.data[i].dash.dashlength;
            let space = cd.el.data[i].dash.space;
            dataset.borderDash = [dashLength, space];
        };
        if (cd.el.data[i].offset != null){
            barOffset = cd.el.data[i].offset;
        };
    };

    if (cd.el.addons.typechart[i] == "point") {
        dataset.backgroundColor = "rgba(0,0,0,0)";
        dataset.type = "line";
        dataset.borderColor = "rgba(0,0,0,0)";
        dataset.pointRadius = cd.el.data[i].pointradius;
        dataset.pointHoverRadius = cd.el.data[i].pointradius + 1;
        dataset.pointHitRadius = 20;
        dataset.pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
    };

    if (cd.el.addons.typechart[i] == "samples") {
        dataset.backgroundColor = color.replace(")", ", 0.3)").replace("rgb", "rgba");
        dataset.type = "line";
        dataset.borderColor = "rgba(0,0,0,0)";
        dataset.lineTension = 0.3;
        if (time) { dataset.lineTension = 0; };
        dataset.pointRadius = 3;
        dataset.pointHoverRadius = 4;
        dataset.pointHitRadius = 20;
        dataset.pointBackgroundColor = color.replace(")", ", 1)").replace("rgb", "rgba");
        if (cd.el.data[i].offset != null){
            barOffset = cd.el.data[i].offset;
        };
    };

    return dataset;
};