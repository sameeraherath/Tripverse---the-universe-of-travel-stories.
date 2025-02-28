const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const generateContent = async (req, res) => {
  const { prompt, maxLength = 100 } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "promt is required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { inputs: prompt, parameters: { max_length: maxLength } },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ content: response.data[0].generated_text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Error generating content", error });
  }
};

module.exports = { generateContent };
