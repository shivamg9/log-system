import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchLogs = async (filters) => {
    try {
        // URLSearchParams handles encoding and removes empty parameters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });

        const response = await axios.get(`${API_URL}/logs?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs:", error);
        throw error; // Re-throw to be caught by the component
    }
};