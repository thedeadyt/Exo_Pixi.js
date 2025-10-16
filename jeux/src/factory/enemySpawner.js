import { Enemy } from "../entities/Enemy.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

/**
 * Module de gestion du spawn des ennemis
 * Les ennemis basiques spawned au début, le boss spawn après leur défaite
 */

/**
 * Trouve une position aléatoire valide sur une tuile ROAD
 * Évite la position de spawn du joueur
 *
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {{x: number, y: number}} Position en pixels
 */
function getRandomRoadPositionInRadius(grid, playerPos, radius) {
    const roadPositions = [];
    const maxDistance = radius * TILE_SIZE;

    // Parcourir toute la grille pour trouver les tuiles ROAD
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === TILE_TYPES.ROAD) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;
                
                // Calculer la distance avec le joueur
                const dx = x - playerPos.x;
                const dy = y - playerPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Vérifier si la position est dans le rayon et différente de celle du joueur
                if (distance <= maxDistance && (x !== playerPos.x || y !== playerPos.y)) {
                    roadPositions.push({ row, col });
                }
            }
        }
    }

    // Si aucune position n'est trouvée dans le rayon, utiliser getRandomRoadPosition normal
    if (roadPositions.length === 0) {
        return getRandomRoadPosition(grid, playerPos);
    }

    // Choisir une position aléatoire parmi les routes dans le rayon
    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];
    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
}

function getRandomRoadPosition(grid, playerPos) {
    const roadPositions = [];

    // Parcourir toute la grille pour trouver les tuiles ROAD
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === TILE_TYPES.ROAD) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                // Éviter la position du joueur
                if (x !== playerPos.x || y !== playerPos.y) {
                    roadPositions.push({ row, col });
                }
            }
        }
    }

    // Vérifier qu'il y a au moins une route
    if (roadPositions.length === 0) {
        console.warn("Aucune ROAD trouvée pour spawner les ennemis");
        return { x: 0, y: 0 };
    }

    // Choisir une position aléatoire parmi les routes
    const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];

    // Convertir les coordonnées de grille en pixels
    return {
        x: randomPos.col * TILE_SIZE,
        y: randomPos.row * TILE_SIZE
    };
}

/**
 * Génère des ennemis basiques sur la map
 * Les boss ne sont PAS spawnés ici, ils apparaissent après la défaite de tous les basiques
 * Évite la position de spawn du joueur
 *
 * @param {PIXI.Application} app - L'application Pixi.js
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {Array<Object>} allEnemies - Tous les ennemis disponibles de l'API
 * @param {number} basicCount - Nombre d'ennemis basiques à spawner
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {Object} { enemies: Array<Enemy>, bossData: Array<Object> }
 */
export function spawnEnemies(app, grid, allEnemies, basicCount = 5, playerPos = {x: 0, y: 0}) {
    // Séparer les ennemis par type
    const basics = allEnemies.filter(enemy => enemy.type === "basic");
    const bosses = allEnemies.filter(enemy => enemy.type === "boss");

    const enemies = [];

    // Spawner uniquement les ennemis basiques
    // Les boss ne doivent PAS spawner maintenant
    for (let i = 0; i < basicCount; i++) {
        if (basics.length > 0) {
            // Choisir un ennemi basique aléatoire (peut être le même plusieurs fois)
            const randomIndex = Math.floor(Math.random() * basics.length);
            const enemyData = basics[randomIndex];

            // Trouver une position et créer l'ennemi
            const pos = getRandomRoadPosition(grid, playerPos);
            const enemy = new Enemy(app, enemyData, pos.x, pos.y);
            enemies.push(enemy);
        }
    }

    console.log(`Spawned ${enemies.length} basic enemies:`, enemies.map(e => e.data.name));

    // Retourner les ennemis créés ET les données des boss pour plus tard
    return { enemies, bossData: bosses };
}

/**
 * Spawne un boss aléatoire sur la map
 * À appeler UNIQUEMENT quand tous les ennemis basiques sont vaincus
 * Évite la position de spawn du joueur
 *
 * @param {PIXI.Application} app - L'application Pixi.js
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {Array<Object>} bossData - Les données des boss disponibles
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {Enemy|null} Le boss créé, ou null si aucun boss disponible
 */
export function spawnBoss(app, grid, bossData, playerPos = {x: 0, y: 0}) {
    if (bossData.length === 0) {
        console.warn("Aucun boss disponible");
        return null;
    }

    // Choisir un boss aléatoire
    const randomIndex = Math.floor(Math.random() * bossData.length);
    const boss = bossData[randomIndex];

    // Trouver une position dans un rayon de 5 tuiles autour du joueur
    const spawnRadius = 5; // Le boss apparaîtra dans un rayon de 5 tuiles
    const pos = getRandomRoadPositionInRadius(grid, playerPos, spawnRadius);
    const enemy = new Enemy(app, boss, pos.x, pos.y);

    console.log(`🔥 BOSS SPAWNED: ${enemy.data.name} dans un rayon de ${spawnRadius} tuiles`);
    return enemy;
}
