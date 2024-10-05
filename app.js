import express from 'express'; 
import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

// New endpoint to handle prompt requests
app.post('/prompt', async (req, res) => {
  const userPrompt = req.body.prompt; // Get the prompt from the request body
  if (!userPrompt) {
    return res.status(400).send('Prompt is required'); // Handle missing prompt
  }

  try {
    const chatCompletion = await getGroqChatCompletion(userPrompt); // Pass the prompt to the function
    res.json(chatCompletion); // Send the response back
  } catch (error) {
    res.status(500).send('Error processing request'); // Handle errors
  }
});

// Modify the getGroqChatCompletion function to accept a prompt
export async function getGroqChatCompletion(userPrompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userPrompt, // Use the provided prompt
      },
    ],
    model: "llama-3.1-70b-versatile",
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

