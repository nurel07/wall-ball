// list-models.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("Missing GOOGLE_API_KEY");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Access the model listing via the API if possible, or we can try a few known ones.
    // The SDK might not have a direct listModels on the main class easily accessible in this version without looking up docs.
    // However, usually it's on the client. Let's try to just run a known working one for now if this is complex.
    // Actually, let's just try gemini-1.5-pro-latest or gemini-1.5-flash which are standard. 
    // But let's verify if I can list them.

    console.log("Checking commonly available models...");
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Test");
            console.log(`✅ Model ${m} is WORKING`);
            return; // found one
        } catch (e) {
            console.log(`❌ Model ${m} failed: ${e.message.split('\n')[0]}`);
        }
    }
}

listModels();
