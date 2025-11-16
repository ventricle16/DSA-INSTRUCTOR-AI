// This line makes 'fetch' available in the serverless environment
import fetch from 'node-fetch';

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the user's prompt from the front-end request
  const { prompt } = request.body;
  
  // Get the secret API key from your Vercel Environment Variables
  const API_KEY = process.env.GOOGLE_API_KEY;
  const MODEL_NAME = "gemini-1.5-flash-latest";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const requestBody = {
      "contents": [{ "parts": [{ "text": prompt }] }],
      "systemInstruction": { "parts": [{ "text": "You are a DSA Instructor. You must only reply to questions related to Data Structures and Algorithms. Provide simple, polite explanations with code examples. If the user asks a non-DSA question, you must reply rudely. For example, if asked 'How are you?', reply with 'Dumb question. Focus on algorithms.' Be creative with rude responses for off-topic questions." }] }
  };

  try {
    const googleResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error("Google API Error:", data);
      return response.status(googleResponse.status).json(data);
    }

    return response.status(200).json(data);

  } catch (error) {
    console.error("Error in Vercel function:", error);
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}


