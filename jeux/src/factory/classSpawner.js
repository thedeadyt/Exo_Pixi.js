import { ClassOrb } from "../entities/ClassOrb.js";
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
        console.warn("No ROAD found for class orbs");
        return { x: 0, y: 0 };
    }

    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];

    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
}

export function spawnClasses(grid, allClasses, playerPos = {x: 0, y: 0}) {
    const classOrbs = [];

    allClasses.forEach(classData => {
        for (let i = 0; i < 4; i++) {
            const pos = getRandomRoadPosition(grid, playerPos);
            const classOrb = new ClassOrb(classData, pos.x, pos.y);
            classOrbs.push(classOrb);
        }
    });

    console.log(`Spawned ${classOrbs.length} class orbs (x4 per class):`, classOrbs.map(c => c.data.name));
    return classOrbs;
}
