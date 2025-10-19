import { TILE_TYPES, TILE_SIZE } from "./consts.js";

export function getCenterRoadPosition(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);

    const toPixelCenter = (gx, gy) => ({
        x: gx * TILE_SIZE + TILE_SIZE / 2,
        y: gy * TILE_SIZE + TILE_SIZE / 2,
    });

    if (grid[cy][cx] === TILE_TYPES.ROAD) {
        return toPixelCenter(cx, cy);
    }

    const maxRadius = Math.max(rows, cols);
    for (let r = 1; r <= maxRadius; r++) {
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const nx = cx + dx;
                const ny = cy + dy;

                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                    if (grid[ny][nx] === TILE_TYPES.ROAD) {
                        console.log(`ROAD found at (${nx}, ${ny})`);
                        return toPixelCenter(nx, ny);
                    }
                }
            }
        }
    }

    console.warn("No ROAD found, spawning at center");
    return toPixelCenter(cx, cy);
}
