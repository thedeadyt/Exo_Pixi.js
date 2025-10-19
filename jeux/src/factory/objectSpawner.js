import { GameObject } from "../entities/Object.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

function selectRandomObjects(allObjects, itemCount, weaponCount, jewelryCount) {
    const items = allObjects.filter(obj => obj.type === "item");
    const weapons = allObjects.filter(obj => obj.type === "weapon");
    const jewelry = allObjects.filter(obj => obj.type === "jewelry");

    const selected = [];

    for (let i = 0; i < itemCount && items.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * items.length);
        selected.push(items.splice(randomIndex, 1)[0]);
    }

    for (let i = 0; i < weaponCount && weapons.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * weapons.length);
        selected.push(weapons.splice(randomIndex, 1)[0]);
    }

    for (let i = 0; i < jewelryCount && jewelry.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * jewelry.length);
        selected.push(jewelry.splice(randomIndex, 1)[0]);
    }

    return selected;
}

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
        console.warn("No ROAD found for objects");
        return { x: 0, y: 0 };
    }

    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];

    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
}

export function spawnObjects(grid, allObjects, itemCount = 2, weaponCount = 3, jewelryCount = 2, playerPos = {x: 0, y: 0}) {
    const selectedObjects = selectRandomObjects(allObjects, itemCount, weaponCount, jewelryCount);
    const gameObjects = [];

    selectedObjects.forEach(objectData => {
        const pos = getRandomRoadPosition(grid, playerPos);
        const gameObject = new GameObject(objectData, pos.x, pos.y);
        gameObjects.push(gameObject);
    });

    console.log(`Spawned ${gameObjects.length} objects:`, gameObjects.map(o => o.data.name));
    return gameObjects;
}
