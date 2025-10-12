const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const fixGrammarMistakes = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    // Use OpenAI API for better grammar correction
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful grammar correction assistant. Fix grammar, spelling, and improve the text while keeping the original meaning and style. Only return the corrected text, no explanations."
          },
          {
            role: "user",
            content: content
          }
        ],
        max_tokens: Math.min(content.length * 2, 1000),
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const correctedContent = response.data.choices[0].message.content.trim();
    
    res.status(200).json({ 
      content: correctedContent,
      originalContent: content 
    });
  } catch (error) {
    console.error("Error fixing grammar with OpenAI:", error);
    
    // Fallback to Hugging Face GPT-2 if OpenAI fails
    try {
      const fallbackResponse = await axios.post(
        "https://api-inference.huggingface.co/models/gpt2",
        { 
          inputs: `Correct this text: ${content}`,
          parameters: { 
            max_length: Math.min(content.length + 100, 200),
            temperature: 0.3,
            do_sample: true
          } 
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      let fallbackContent = fallbackResponse.data[0].generated_text;
      if (fallbackContent.includes("Correct this text:")) {
        fallbackContent = fallbackContent.replace("Correct this text:", "").trim();
      }
      
      res.status(200).json({ 
        content: fallbackContent || content,
        originalContent: content,
        warning: "Using basic text improvement"
      });
    } catch (fallbackError) {
      console.error("Fallback grammar correction failed:", fallbackError);
      
      // Final fallback: simple text improvements
      const simpleCorrections = performSimpleGrammarCorrections(content);
      
      res.status(200).json({ 
        content: simpleCorrections,
        originalContent: content,
        warning: "Using basic grammar rules"
      });
    }
  }
};

// Simple grammar correction function as final fallback
const performSimpleGrammarCorrections = (text) => {
  let corrected = text;
  
  // Basic corrections
  corrected = corrected.replace(/\bi\b/g, 'I'); // Capitalize 'i'
  corrected = corrected.replace(/\s+/g, ' '); // Remove extra spaces
  corrected = corrected.replace(/\s+([.!?])/g, '$1'); // Remove spaces before punctuation
  corrected = corrected.replace(/([.!?])\s*([a-z])/g, '$1 $2'); // Add space after punctuation
  corrected = corrected.replace(/([.!?])\s*([A-Z])/g, '$1 $2'); // Add space after punctuation before capital
  
  // Capitalize first letter of sentences
  corrected = corrected.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
  
  return corrected.trim();
};

module.exports = { fixGrammarMistakes };
