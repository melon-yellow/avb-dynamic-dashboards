//write to canvas function
export async function canvasDisplay(cd, canvas, ctx) {
    //check for canvas add-on
    if (cd.el.addons.canvas != null) {
        if (cd.el.addons.canvas.posx != null) {
            if (cd.el.addons.canvas.posy != null) {
                //clear interval constructor
                if (cd.el.addons.canvas.interval != null) {
                    clearInterval(cd.el.addons.canvas.interval); };
                //set interval constructor
                cd.el.addons.canvas.interval = setInterval(
                    async() => {
                        let posx = cd.el.addons.canvas.posx;
                        let posy = cd.el.addons.canvas.posy;
                        let fontsize = cd.el.addons.canvas.fontsize;
                        let font = cd.el.addons.canvas.font;
                        let fillstyle = cd.el.addons.canvas.fillstyle;
                        let background = cd.el.addons.canvas.background;
                        let dataset = cd.el.addons.canvas.data;
                        let content = window.page.datasets[dataset].data;
                        // construct canvas
                        let unitx = (canvas.width / 100);
                        let unity = (canvas.height / 100);
                        let fontfixed = fontsize * unity;
                        let posxfixed = posx * unitx;
                        let posyfixed = posy * unity;
                        let contentlength = ctx.measureText(content).width + 5;
                        // fill context
                        ctx.fillStyle = background;
                        ctx.fillRect((posxfixed), (posyfixed - (0.5 * fontfixed)), contentlength, fontfixed);
                        ctx.font = fontfixed + "px " + font;
                        ctx.fillStyle = fillstyle;
                        ctx.fillText(content, posxfixed, posyfixed);
                        ctx.fillStyle = "ffffff";
                        ctx.font = "12px";
                    }, 1);
            };
        };
    };
    // return interval
    return cd.el.addons.canvas.interval;
};
