//DRAW LEGEND DROPDOWN FUNCTION

export async function dropdownLegend(e, legendItem, ci, ctx, canvas, inputsArray) {

    //get index of this legend
    let index = legendItem.datasetIndex;


    //create canvashover object and options
    if (window.page.canvashover == null) {
        window.page.canvashover = {};
    };
    if (window.page.canvashover.options == null) {
        window.page.canvashover.options = [];
    };

    //option 0 do
    if (window.page.canvashover.options[0] == null) {
        //crate option 0
        window.page.canvashover.options[0] = {};

        //hide chart call function
        async function func1() {
            if (index != null) {
                ci.data.datasets[index].hidden = !ci.data.datasets[index].hidden;
            } else {
                let indexq = legendItem.index;
                let ilen;
                for (let i = 0, ilen = (ci.data.datasets || []).length; i < ilen; ++i) {
                    let meta = ci.getDatasetMeta(i);
                    meta.data[indexq].hidden = !meta.data[indexq].hidden;
                }
            };
            document.removeEventListener('mousemove', window.page.canvashover.mouseon);
            canvas.removeEventListener('click', window.page.canvashover.selectItem);
            window.page.canvashover = null;
            ci.update();
        };

        //assign function to index
        window.page.canvashover.options[0].function = func1;
        window.page.canvashover.options[0].text = "Display";
    };

    //option 1 do
    if (window.page.canvashover.options[1] == null) {
        if (index != null) {
            if (ci.data.datasets[index].type == "line" || ci.data.datasets[index].type == "bar") {
                //crate option 1
                window.page.canvashover.options[1] = {};

                //change chart call function
                async function func2() {
                    document.removeEventListener('mousemove', window.page.canvashover.mouseon);
                    canvas.removeEventListener('click', window.page.canvashover.selectItem);
                    window.page.canvashover = null;
                    eval(inputsArray[0] + "(" + index + ")");
                };

                //get type of chart
                if (ci.data.datasets[index].type == "line") {
                    window.page.canvashover.options[1].function = func2;
                    window.page.canvashover.options[1].text = "Bar Chart";
                };
                if (ci.data.datasets[index].type == "bar") {
                    window.page.canvashover.options[1].function = func2;
                    window.page.canvashover.options[1].text = "Line Chart";
                };
            };
        };
    };

    //set dimentions of item
    let item = {
        width: 70,
        height: 20
    };

    //get mouse position
    async function getMousePos(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };
    let pos = await getMousePos(canvas, e);

    //calculate position of display canvas
    let wdtc = Number(canvas.style.width.replace("px", ""));
    if (pos.x + 60 + 10 > wdtc) {
        pos.x = wdtc - 50;
    };
    let sty = pos.y + 10;
    let stys = sty + (item.height * window.page.canvashover.options.length);
    let hgtc = Number(canvas.style.height.replace("px", ""));
    if (stys + 10 > hgtc) {
        pos.y = hgtc - (stys - sty) - 15;
    };

    sty = pos.y + 10;

    //run once display function
    if (window.page.canvashover.in == null) {
        //set canvas hover in true
        window.page.canvashover.in = true;

        stys = sty + (item.height * window.page.canvashover.options.length);
        window.page.canvashover.undo = {};
        window.page.canvashover.undo.x = pos.x - item.width - 10;
        window.page.canvashover.undo.y = pos.y - 10;
        window.page.canvashover.undo.xe = pos.x + item.width + 10;
        window.page.canvashover.undo.ye = stys + 10;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgb(124,124,124)";
        ctx.fillStyle = "white";
        ctx.fillRect(pos.x - 26, sty - 3, item.width, (item.height * window.page.canvashover.options.length));
        for (let i = 0; i < window.page.canvashover.options.length; i++) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgb(64,64,64)";
            ctx.fillText(window.page.canvashover.options[i].text, pos.x - 20, sty + 8);
            window.page.canvashover.options[i].left = pos.x - 26;
            window.page.canvashover.options[i].top = sty - 3;
            window.page.canvashover.options[i].right = pos.x - 26 + item.width;
            window.page.canvashover.options[i].bottom = sty - 3 + item.height;
            sty += item.height;
        };

        //select clicked item function
        async function selectItem(ev) {
            let rect = ev.target.getBoundingClientRect();
            let pos = {};
            pos.x = ev.clientX - rect.left;
            pos.y = ev.clientY - rect.top;
            for (let i = 0; i < window.page.canvashover.options.length; i++) {
                let a = (pos.x < (window.page.canvashover.options[i].right));
                let b = (pos.x > (window.page.canvashover.options[i].left));
                let c = (pos.y < (window.page.canvashover.options[i].bottom));
                let d = (pos.y > (window.page.canvashover.options[i].top));
                if (a && b && c && d) {
                    let thisf = await window.page.canvashover.options[i].function();
                };
            };
        };
        window.page.canvashover.selectItem = selectItem;

        async function mouseon(ev) {
            let rect = canvas.getBoundingClientRect();
            let pos = {};
            pos.x = ev.clientX - rect.left;
            pos.y = ev.clientY - rect.top;
            //check if mouse is out
            let mover = false;
            let a = (pos.x > (window.page.canvashover.undo.x + 10));
            let b = (pos.x < (window.page.canvashover.undo.xe - 10));
            let c = (pos.y > (window.page.canvashover.undo.y));
            let d = (pos.y < (window.page.canvashover.undo.ye - 10));
            if (a && b && c && d) {
                mover = true;
            };
            //if mouse is out of the area
            if (!mover) {
                canvas.removeEventListener('click', window.page.canvashover.selectItem);
                document.removeEventListener('mousemove', window.page.canvashover.mouseon);
                window.page.canvashover = null;
                ci.update();
            };
        };
        window.page.canvashover.mouseon = mouseon;

        //add click event listener
        canvas.addEventListener('click', window.page.canvashover.selectItem);

        //add get out event listener
        document.addEventListener('mousemove', window.page.canvashover.mouseon);
    };

}; //End of exported function