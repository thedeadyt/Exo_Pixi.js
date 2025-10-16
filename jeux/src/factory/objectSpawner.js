import { GameObject } from "../entities/Object.js";
import { TILE_SIZE, TILE_TYPES } from "../utils/consts.js";

/**
 * Module de gestion du spawn des objets collectables
 * Gère la sélection aléatoire et le placement sur la map
 */

/**
 * Sélectionne des objets aléatoires selon les quantités demandées
 * Les objets sont retirés de la liste pour éviter les doublons
 *
 * @param {Array<Object>} allObjects - Tous les objets disponibles de l'API
 * @param {number} itemCount - Nombre d'items (armures, bottes, etc.)
 * @param {number} weaponCount - Nombre d'armes
 * @param {number} jewelryCount - Nombre de bijoux
 * @returns {Array<Object>} Liste des objets sélectionnés
 */
function selectRandomObjects(allObjects, itemCount, weaponCount, jewelryCount) {
    // Séparer les objets par type
    const items = allObjects.filter(obj => obj.type === "item");
    const weapons = allObjects.filter(obj => obj.type === "weapon");
    const jewelry = allObjects.filter(obj => obj.type === "jewelry");

    const selected = [];

    // Sélectionner des items aléatoires (sans doublons)
    for (let i = 0; i < itemCount && items.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * items.length);
        selected.push(items.splice(randomIndex, 1)[0]);
    }

    // Sélectionner des armes aléatoires (sans doublons)
    for (let i = 0; i < weaponCount && weapons.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * weapons.length);
        selected.push(weapons.splice(randomIndex, 1)[0]);
    }

    // Sélectionner des bijoux aléatoires (sans doublons)
    for (let i = 0; i < jewelryCount && jewelry.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * jewelry.length);
        selected.push(jewelry.splice(randomIndex, 1)[0]);
    }

    return selected;
}

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
        console.warn("Aucune ROAD trouvée pour spawner les objets");
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
 * Génère des objets collectables sur la map
 * Sélectionne des objets aléatoires et les place sur des positions ROAD
 * Évite la position de spawn du joueur
 *
 * @param {Array<Array<number>>} grid - La grille de la map
 * @param {Array<Object>} allObjects - Tous les objets disponibles de l'API
 * @param {number} itemCount - Nombre d'items à spawner
 * @param {number} weaponCount - Nombre d'armes à spawner
 * @param {number} jewelryCount - Nombre de bijoux à spawner
 * @param {{x: number, y: number}} playerPos - Position du joueur à éviter
 * @returns {Array<GameObject>} Liste des GameObject créés
 */
export function spawnObjects(grid, allObjects, itemCount = 2, weaponCount = 3, jewelryCount = 2, playerPos = {x: 0, y: 0}) {
    // Sélectionner les objets à spawner
    const selectedObjects = selectRandomObjects(allObjects, itemCount, weaponCount, jewelryCount);
    const gameObjects = [];

    // Créer un GameObject pour chaque objet sélectionné
    selectedObjects.forEach(objectData => {
        const pos = getRandomRoadPosition(grid, playerPos);
        const gameObject = new GameObject(objectData, pos.x, pos.y);
        gameObjects.push(gameObject);
    });

    console.log(`Spawned ${gameObjects.length} objects:`, gameObjects.map(o => o.data.name));
    return gameObjects;
}
