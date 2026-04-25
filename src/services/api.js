import axios from "axios";

const API = axios.create({
    baseURL: "https://sevasync-backend-917106621948.us-central1.run.apphttp://localhost:5000",
});

// Send text to backend (AI parsing)
export const parseText = (text) =>
    API.post("/parse-text", { text });

// Get all needs
export const getNeeds = () =>
    API.get("/needs");

// Match volunteers
export const matchVolunteers = (needId) =>
    API.post("/match-volunteers", { need_id: needId });

// Analyze image
export const analyzeImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return API.post("/analyze-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export default API;