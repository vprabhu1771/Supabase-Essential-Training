```
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askQuestion(question) {

  // console.log("API Key:", OPENAI_API_KEY);
  // console.log("Loaded API Key:", process.env.OPENAI_API_KEY); // Debugging

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
      }),
    });

    console.log( response.status);
    
    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    
    console.error("Error:", error.message);
    return "An error occurred while fetching the reply.";
  }
}

// Example Usage
const userQuestion = "What is the capital of France?";
askQuestion(userQuestion).then((reply) => console.log("AI Reply:", reply));
```
