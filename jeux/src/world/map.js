import { Container, Graphics, GraphicsContext } from "pixi.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

/**
 * Cr�e le conteneur de la map avec tous les tiles
 * @param {Array<Array<number>>} grid - La grille de donn�es de la map
 * @returns {Container} Le conteneur de la map
 */
export function createMap(grid) {
    const mapContainer = new Container();

    // Cr�ation des contextes graphiques pour les tiles
    const roadTile = new GraphicsContext()
        .rect(50, 50, TILE_SIZE, TILE_SIZE)
        .fill("Brown");

    const forestTile = new GraphicsContext()
        .rect(50, 50, TILE_SIZE, TILE_SIZE)
        .fill("Green");

    // G�n�ration de tous les tiles de la map
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const tileGraphicsContext = grid[y][x] === TILE_TYPES.FOREST
                ? forestTile
                : roadTile;

            const tile = new Graphics(tileGraphicsContext);
            tile.x = x * TILE_SIZE;
            tile.y = y * TILE_SIZE;

            mapContainer.addChild(tile);
        }
    }

    return mapContainer;
}
