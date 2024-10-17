import Groq from "groq-sdk";

// Use Vite's import.meta.env to access environment variables
const apiKey = "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";
console.log("GROQ_API_KEY:", apiKey); // Debugging line

const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion(transcript, customPrompt, taskType) {
  let systemPrompt;

  if (taskType === "analyze") {
    systemPrompt = customPrompt 
      ? `${customPrompt} Please analyze the following comments: ${transcript}` 
      : `Please analyze the following comments: ${transcript}`;
  } else if (taskType === "summarize") {
    systemPrompt = customPrompt 
      ? `${customPrompt} Please summarize the following transcript: ${transcript}` 
      : `Please summarize the following transcript: ${transcript}`;
  } else {
    throw new Error("Invalid task type specified.");
  }

  const apiResponse = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: systemPrompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  console.log("GROQ API Response:", apiResponse); // Log the response for debugging
  return apiResponse.choices[0]?.message?.content || "No analysis available."; // Adjust based on actual response structure
}