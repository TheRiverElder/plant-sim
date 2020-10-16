function paintHeatmap(heatmap: number[][], canvas: HTMLCanvasElement, cellWidth: number, maxValue: number, grid: boolean) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const halfCellWidth = cellWidth / 2;
    const data = new Uint8ClampedArray(4 * canvas.width * canvas.height);

    const getHeatAt = (x: number, y: number) => heatmap[y + 1][x + 1];

    const canH = canvas.height;
    const canW = canvas.width;
    // console.time('loop');
    for (let rpy = 0; rpy < canH; rpy++) {
        for (let rpx = 0; rpx < canW; rpx++) {
            const index = rpy * canvas.width * 4 + rpx * 4;

            const px = rpx - halfCellWidth;
            const py = rpy - halfCellWidth;
            const x0 = Math.floor(px / cellWidth);
            const y0 = Math.floor(py / cellWidth);
            const dx = ((px + cellWidth) % cellWidth) / cellWidth;
            const dy = ((py + cellWidth) % cellWidth) / cellWidth;

            const heat = (1 - dy) * ((1 - dx) * getHeatAt(x0, y0) + dx * getHeatAt(x0 + 1, y0)) + dy * ((1 - dx) * getHeatAt(x0, y0 + 1) + dx * getHeatAt(x0 + 1, y0 + 1));

            const color = Math.floor(0x04ff * Math.min(heat / maxValue, 1));
            let r = 0;
            let g = 0;
            let b = 0;
            
            if (color <= 0xff) { // #000000~#0000FF
                b = color;
            } else if (color <= 0x1ff) { // #0000FF~#FF00FF
                r = color - 0x0100;
                b = 0xff;
            } else if (color <= 0x2ff) { // #FF00FF~#FF0000
                r = 0xff;
                b = 0xff - (color - 0x0200);
            } else if (color <= 0x3ff) { // #FF0000~#FFFF00
                r = 0xff;
                g = color - 0x0300;
            } else if (color <= 0x4ff) { // #FFFF00~#FFFFFF
                r = g = 0xff;
                b = color - 0x0400;
            }

            if (grid && (!(rpx % cellWidth) || !(rpy % cellWidth))) {
                r ^= 0xFF;
                g ^= 0xFF;
                b ^= 0xFF;
            }
            data[index + 0] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = 0xff;
        }
    }
    // console.timeEnd('loop');
    const imageData = new ImageData(data, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
}

export {
    paintHeatmap,
}