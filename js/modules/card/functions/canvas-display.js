//write to canvas function
export async function canvasDisplay(canvas, ctx, posx, posy, content, fontsize, font, fillstyle, background) {

    let unitx = (canvas.width / 100);
    let unity = (canvas.height / 100);
    let fontfixed = fontsize * unity;
    let posxfixed = posx * unitx;
    let posyfixed = posy * unity;
    ctx.fillStyle = background;
    let contentlength = ctx.measureText(content).width + 5;
    ctx.fillRect((posxfixed), (posyfixed - (0.5 * fontfixed)), contentlength, fontfixed);
    ctx.font = fontfixed + "px " + font;
    ctx.fillStyle = fillstyle;
    ctx.fillText(content, posxfixed, posyfixed);
    ctx.fillStyle = "ffffff";
    ctx.font = "12px";

    return 0;
};
