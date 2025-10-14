import axios from "axios";

const API_BASE_URL = "https://mmi.alarmitou.fr/api";

/**
 * Récupère les données de la map depuis l'API
 * @returns {Promise<Array<Array<number>>>} La grille de la map
 */
export async function fetchMapData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/map`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de la map:", error);
        throw error;
    }
}
