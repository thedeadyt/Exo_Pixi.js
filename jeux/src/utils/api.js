import axios from "axios";
import { MAP_SIZE, API_BASE_URL } from "./consts";

export async function fetchMapData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/map/${MAP_SIZE}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching map:", error);
        throw error;
    }
}

export async function fetchObjectData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/objects`);
        return response.data;
    } catch (error) {
        console.error("Error fetching objects:", error);
        throw error;
    }
}

export async function fetchEnemiesData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/enemies`);
        return response.data;
    } catch (error) {
        console.error("Error fetching enemies:", error);
        throw error;
    }
}

export async function fetchClassesData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/classes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
    }
}

export async function fetchTreasuresData(count = 100) {
    try {
        const response = await axios.get(`${API_BASE_URL}/objects/treasures/${count}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching treasures:", error);
        throw error;
    }
}
