import { Enemy } from "../entities/Enemy.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

function getRandomRoadPositionInRadius(grid, playerPos, radius) {
    const roadPositions = [];
    const maxDistance = radius * TILE_SIZE;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === TILE_TYPES.ROAD) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                const dx = x - playerPos.x;
                const dy = y - playerPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= maxDistance && (x !== playerPos.x || y !== playerPos.y)) {
                    roadPositions.push({ row, col });
                }
            }
        }
    }

    if (roadPositions.length === 0) {
        return getRandomRoadPosition(grid, playerPos);
    }

    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];
    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
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
        console.warn("No ROAD found for enemies");
        return { x: 0, y: 0 };
    }

    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];

    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
}

export function spawnEnemies(app, grid, allEnemies, basicCount = 5, playerPos = {x: 0, y: 0}) {
    const basics = allEnemies.filter(enemy => enemy.type === "basic");
    const bosses = allEnemies.filter(enemy => enemy.type === "boss");

    const enemies = [];

    for (let i = 0; i < basicCount; i++) {
        if (basics.length > 0) {
            const randomIndex = Math.floor(Math.random() * basics.length);
            const enemyData = basics[randomIndex];

            const pos = getRandomRoadPosition(grid, playerPos);
            const enemy = new Enemy(app, enemyData, pos.x, pos.y);
            enemies.push(enemy);
        }
    }

    console.log(`Spawned ${enemies.length} basic enemies:`, enemies.map(e => e.data.name));

    return { enemies, bossData: bosses };
}

export function spawnBoss(app, grid, bossData, playerPos = {x: 0, y: 0}) {
    if (bossData.length === 0) {
        console.warn("No boss available");
        return null;
    }

    const randomIndex = Math.floor(Math.random() * bossData.length);
    const boss = bossData[randomIndex];

    const spawnRadius = 5;
    const pos = getRandomRoadPositionInRadius(grid, playerPos, spawnRadius);
    const enemy = new Enemy(app, boss, pos.x, pos.y);

    console.log(`BOSS SPAWNED: ${enemy.data.name} in radius of ${spawnRadius} tiles`);
    return enemy;
}
