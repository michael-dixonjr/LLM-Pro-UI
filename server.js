const PORT = 8000;
const express = require("express");
const cors = require("cors");
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");
require("dotenv").config();
const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());


const API_KEY = process.env.API_KEY;

const textToSpeechClient = new TextToSpeechClient({
  projectId: "wired-episode-389217",
  keyFilename: "./src/wired-episode-389217-e3ea1afbf8e1.json",
});

app.post("/completions", async (req, res) => {
  const { message, chatHistory, systemPrompt, temperature, maxTokens, model } = req.body;

  try {
    // Make an API call to OpenAI to get the message response
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: message },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Errorf" });
  }
});

app.post("/text-to-speech", async (req, res) => {
  const { text } = req.body;

  try {
    const [response] = await textToSpeechClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode: "en-US", name: "en-US-Wavenet-F", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" },
    });

    res.send(response.audioContent);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Errort" });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));