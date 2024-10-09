import express from 'express'; 
import Groq from "groq-sdk";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the CORS middleware

// Load environment variables from the .env file
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();

// Use CORS middleware
app.use(cors()); // Allow all origins (you can configure this for specific origins)
app.use(express.json()); // Middleware to parse JSON requests
app.use(bodyParser.json());

// New endpoint to handle analysis requests
app.post('/analyze', async (req, res) => {
  const { comments } = req.body;

  if (!comments || comments.length === 0) {
    return res.status(400).send('Comments are required for analysis.');
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Analyze the following comments: ${comments.join(' ')}. Please provide insights on the sentiment and key themes present in these comments.`,
        },
      ],
      model: "mixtral-8x7b-32768", // Specify the model to use
    });

    res.json(chatCompletion); // Send the completion back to the client
  } catch (error) {
    console.error("Error analyzing comments:", error);
    res.status(500).json({ error: 'Failed to analyze comments' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

