import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const EXTERNAL_API = process.env.EXTERNAL_API;
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
};

router.get("/", async (req, res) => {
  try {
    const recipesResponse = await axios.get(
      `${EXTERNAL_API}?q=avocado&type=public&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const recipesData = recipesResponse.data;
    return res.status(200).json(recipesData);
  } catch (err) {
    console.error("Failed to fetch recipes:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch recipes", error: err.message });
  }
});

router.post("/", async (req, res) => {
  if (!req.body.q || req.body.q.length === 0) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }

  function convertJSON(json) {
    let queryParams = [];

    for (let key in json) {
      json[key].forEach((value) => {
        queryParams.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        );
      });
    }

    return "?" + queryParams.join("&");
  }

  const queryString = convertJSON(req.body);

  try {
    const recipesResponse = await axios.get(
      `${EXTERNAL_API}${queryString}&type=public&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const recipesData = recipesResponse.data;
    if (recipesData.count === 0) {
      return res.status(400).json({
        message:
          "Error fetching search results. Please, try with another selection.",
      });
    }
    return res.status(200).json(recipesData);
  } catch (err) {
    console.error("Failed to search recipes:", err.message);
    res
      .status(500)
      .json({ message: "Failed to search recipes", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipeResponse = await axios.get(
      `${EXTERNAL_API}/${recipeId}?type=public&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const recipeData = recipeResponse.data;

    if (!recipeData) {
      res.status(404).json({ message: "A recipe with that id is not found." });
    }
    return res.status(200).json(recipeData);
  } catch (err) {
    console.error("Failed to fetch recipe by ID:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch recipe", error: err.message });
  }
});

router.use(errorHandler);

export default router;
