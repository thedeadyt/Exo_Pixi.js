export const TILE_SIZE = 40;
export const MAP_SIZE = 80;
export const API_BASE_URL = "https://mmi.alarmitou.fr/api";

export const TILE_TYPES = {
    FOREST: 0,
    ROAD: 1
};

export function getObjectCountForMapSize(mapGrid) {
    const totalTiles = mapGrid.length * mapGrid[0].length;

    const baseRatio = 30;
    const scaleFactor = Math.sqrt(totalTiles) / 100;
    const objectRatio = Math.max(20, baseRatio - (scaleFactor * 5));

    const totalObjects = Math.floor(totalTiles / objectRatio);

    const sizeBonus = Math.floor(Math.sqrt(totalTiles) / 10);

    return {
        items: Math.max(5, Math.floor(totalObjects * 0.35) + sizeBonus),
        weapons: Math.max(5, Math.floor(totalObjects * 0.35) + sizeBonus),
        jewelry: Math.max(5, Math.floor(totalObjects * 0.30) + sizeBonus)
    };
}
