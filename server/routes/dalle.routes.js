import express from "express";
import * as dotenv from "dotenv";
import axios from "axios"; // Add Axios for making HTTP requests

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // DeepAI API endpoint and request payload
    const deepAIOptions = {
      method: "POST",
      url: "https://ai-text-to-image-generator-api.p.rapidapi.com/realistic",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "46a2c7df55msh625eb4f0ed02452p15546fjsndab5aa3fdc39",
        "X-RapidAPI-Host": "ai-text-to-image-generator-api.p.rapidapi.com",
      },
      data: {
        inputs: prompt,
      },
    };

    // Make a request to DeepAI API using Axios
    const deepAIResponse = await axios.request(deepAIOptions);
    const imageUrl = deepAIResponse.data.output_url;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
