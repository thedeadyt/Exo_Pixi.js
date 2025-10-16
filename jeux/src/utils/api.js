import axios from "axios";
import { MAP_SIZE, API_BASE_URL } from "./consts";

/**
 * Récupère les données de la map depuis l'API
 * @returns {Promise<Array<Array<number>>>} Grille de la map (0 = forêt, 1 = route)
 */
export async function fetchMapData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/map/${MAP_SIZE}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de la map:", error);
        throw error;
    }
}

/**
 * Récupère la liste des objets depuis l'API
 * (items, weapons, jewelry)
 * @returns {Promise<Array<Object>>} Liste des objets disponibles
 */
export async function fetchObjectData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/objects`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des objets:", error);
        throw error;
    }
}

/**
 * Récupère la liste des ennemis depuis l'API
 * (ennemis basiques et boss)
 * @returns {Promise<Array<Object>>} Liste des ennemis disponibles
 */
export async function fetchEnemiesData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/enemies`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des ennemis:", error);
        throw error;
    }
}

/**
 * Récupère la liste des Classe depuis l'API
 * (rogue, warrior, barbarian, warden)
 * @returns {Promise<Array<Object>>} Liste des classe disponibles
 */
export async function fetchClassesData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/classes`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des ennemis:", error);
        throw error;
    }
}

/**
 * Récupère des trésors (coffres avec 3 objets au choix) depuis l'API
 * @param {number} count - Nombre de trésors à générer
 * @returns {Promise<Array<Object>>} Liste des trésors avec leurs objets
 */
export async function fetchTreasuresData(count = 100) {
    try {
        const response = await axios.get(`${API_BASE_URL}/objects/treasures/${count}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des trésors:", error);
        throw error;
    }
}