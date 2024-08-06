require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const jsonModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" }});

const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

module.exports = { jsonModel, textModel };