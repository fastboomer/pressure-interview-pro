
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");

async function listModels() {
    try {
        const list = await genAI.getGenerativeModel({ model: "gemini-pro" }).listModels();
        console.log(JSON.stringify(list, null, 2));
    } catch (e) {
        console.error(e);
    }
}

// listModels();
console.log("Checking API key...");
if (process.env.VITE_GEMINI_API_KEY) {
    console.log("API Key found (starts with: " + process.env.VITE_GEMINI_API_KEY.substring(0, 5) + ")");
} else {
    console.log("API Key NOT found in .env.local");
}
