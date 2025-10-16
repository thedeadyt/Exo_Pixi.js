import { Treasure } from "../entities/Treasure.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

/**
 * Module de gestion du spawn des coffres de trésor
 * Les trésors contiennent 3 objets au choix pour le joueur
 */

/**
 * Trouve une position aléatoire valide sur une tuile ROAD
 * Évite la position de spawn du joueur
 *
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {{x: number, y: number}} Position en pixels
 */
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
        console.warn("Aucune ROAD trouvée pour spawner les trésors");
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
 * Génère des coffres de trésor sur la map
 * Chaque trésor contient 3 objets au choix
 * Évite la position de spawn du joueur
 *
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {Array<Array<Object>>} treasuresData - Données des trésors depuis l'API (chaque trésor = 3 objets)
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {Array<Treasure>} Liste des Treasure créés
 */
export function spawnTreasures(grid, treasuresData, playerPos = {x: 0, y: 0}) {
    const treasures = [];

    // Créer un coffre pour chaque ensemble de 3 objets
    treasuresData.forEach(treasureItems => {
        const pos = getRandomRoadPosition(grid, playerPos);
        const treasure = new Treasure(treasureItems, pos.x, pos.y);
        treasures.push(treasure);
    });

    console.log(`💎 Spawned ${treasures.length} treasure chests`);
    return treasures;
}
