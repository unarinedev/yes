const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/layout-min.js", async (req, res) => {
  try {

    const userMessage = req.body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "developer", content: "You are a helpful java developer helping me with java answers and code implementations. when you give me code implementations please dont comment or explain any code." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;

    const encoded = Buffer.from(reply).toString("base64");

    res.json({ data: encoded });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating response");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});