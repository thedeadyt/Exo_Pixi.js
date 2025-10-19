import { Container, Graphics, GraphicsContext } from "pixi.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

export function createMap(grid) {
    const mapContainer = new Container();

    const roadTile = new GraphicsContext()
        .rect(0, 0, TILE_SIZE, TILE_SIZE)
        .fill("Brown");

    const forestTile = new GraphicsContext()
        .rect(0, 0, TILE_SIZE, TILE_SIZE)
        .fill("Green");

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const tileGraphicsContext =
                grid[y][x] === TILE_TYPES.ROAD ? roadTile : forestTile;

            const tile = new Graphics(tileGraphicsContext);
            tile.x = x * TILE_SIZE;
            tile.y = y * TILE_SIZE;

            mapContainer.addChild(tile);
        }
    }

    return mapContainer;
}
