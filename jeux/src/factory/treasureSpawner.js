import { Treasure } from "../entities/Treasure.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

function getRandomRoadPosition(grid, playerPos) {
    const roadPositions = [];

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === TILE_TYPES.ROAD) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                if (x !== playerPos.x || y !== playerPos.y) {
                    roadPositions.push({ row, col });
                }
            }
        }
    }

    if (roadPositions.length === 0) {
        console.warn("No ROAD found for treasures");
        return { x: 0, y: 0 };
    }

    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];

    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
}

export function spawnTreasures(grid, treasuresData, playerPos = {x: 0, y: 0}) {
    const treasures = [];

    treasuresData.forEach(treasureItems => {
        const pos = getRandomRoadPosition(grid, playerPos);
        const treasure = new Treasure(treasureItems, pos.x, pos.y);
        treasures.push(treasure);
    });

    console.log(`Spawned ${treasures.length} treasure chests`);
    return treasures;
}
