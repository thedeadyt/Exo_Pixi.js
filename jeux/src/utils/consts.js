/**
 * Fichier de constantes globales du jeu
 */

// Taille d'une tuile en pixels
export const TILE_SIZE = 40;

// Taille de la map (nombre de tuiles par côté)
export const MAP_SIZE = 80; // Réduit temporairement pour éviter le rate limit (était 155)

// URL de base de l'API
export const API_BASE_URL = "https://mmi.alarmitou.fr/api";

// Types de tuiles de la map
export const TILE_TYPES = {
    FOREST: 0,  // Forêt (non traversable)
    ROAD: 1     // Route (traversable)
};

/**
 * Calcule le nombre d'objets à spawner en fonction de la taille de la map
 * Ratio: environ 1 objet tous les 30 tiles (réduit pour de meilleures performances)
 * Plus la map est grande, plus il y a d'objets
 * Répartition: 35% items, 35% weapons, 30% jewelry
 *
 * @param {Array<Array<number>>} mapGrid - La grille de la map
 * @returns {Object} Nombre d'objets par type { items, weapons, jewelry }
 */
export function getObjectCountForMapSize(mapGrid) {
    const totalTiles = mapGrid.length * mapGrid[0].length;

    // Ratio réduit pour éviter trop d'objets
    // Pour une map de 50x50 (2500 tiles), ratio = 30 → ~83 objets
    // Pour une map de 100x100 (10000 tiles), ratio = 25 → ~400 objets
    const baseRatio = 30;
    const scaleFactor = Math.sqrt(totalTiles) / 100;
    const objectRatio = Math.max(20, baseRatio - (scaleFactor * 5));

    // Calculer le nombre total d'objets
    const totalObjects = Math.floor(totalTiles / objectRatio);

    // Bonus modéré pour les grandes maps
    const sizeBonus = Math.floor(Math.sqrt(totalTiles) / 10);

    // Répartir les objets selon les pourcentages avec bonus
    return {
        items: Math.max(5, Math.floor(totalObjects * 0.35) + sizeBonus),    // 35% + bonus
        weapons: Math.max(5, Math.floor(totalObjects * 0.35) + sizeBonus),  // 35% + bonus
        jewelry: Math.max(5, Math.floor(totalObjects * 0.30) + sizeBonus)   // 30% + bonus
    };
}
