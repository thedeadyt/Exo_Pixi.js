import { ClassOrb } from "../entities/ClassOrb.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

/**
 * Module de gestion du spawn des orbes de classe
 * Les orbes permettent au joueur de changer de classe
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
        console.warn("Aucune ROAD trouvée pour spawner les orbes de classe");
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
 * Génère des orbes de classe sur la map
 * Spawne 4 orbes pour chaque classe disponible (x4)
 * Évite la position de spawn du joueur
 *
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {Array<Object>} allClasses - Toutes les classes disponibles de l'API
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {Array<ClassOrb>} Liste des ClassOrb créés
 */
export function spawnClasses(grid, allClasses, playerPos = {x: 0, y: 0}) {
    const classOrbs = [];

    // Créer 4 orbes pour chaque classe disponible (x4)
    allClasses.forEach(classData => {
        for (let i = 0; i < 4; i++) {
            const pos = getRandomRoadPosition(grid, playerPos);
            const classOrb = new ClassOrb(classData, pos.x, pos.y);
            classOrbs.push(classOrb);
        }
    });

    console.log(`🎭 Spawned ${classOrbs.length} class orbs (x4 per class):`, classOrbs.map(c => c.data.name));
    return classOrbs;
}
