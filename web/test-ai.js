// test-ai.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function analyze(imageUrl) {
    if (!imageUrl) {
        console.error("Please provide an image URL: node test-ai.js <url>");
        process.exit(1);
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("Missing GOOGLE_API_KEY in .env");
        process.exit(1);
    }

    console.log("Analyzing:", imageUrl);
    console.log("Using API Key:", apiKey.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");
        const arrayBuffer = await response.arrayBuffer();

        const imagePart = {
            inlineData: {
                data: Buffer.from(arrayBuffer).toString("base64"),
                mimeType: response.headers.get("content-type") || "image/jpeg",
            },
        };

        const prompt = `
      Analyze this fine art wallpaper. 
      Return a STRICT valid JSON object (no markdown formatting, no backticks) with these fields:
      - title (string)
      - artist (string)
      - date (string)
      - description (string)
      - tags (array of strings)
    `;

        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();
        console.log("AI Response:\n", text);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

analyze(process.argv[2]);
