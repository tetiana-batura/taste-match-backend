import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const EXTERNAL_API = process.env.EXTERNAL_API;
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;

router.get("/", async (req, res) => {
  try {
    const recipesResponse = await axios.get(
      `${EXTERNAL_API}?q=avocado&type=public&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const recipesData = recipesResponse.data;
    return res.status(200).json(recipesData);
  } catch (err) {
    // write am error handler
  }
});

router.post("/", async (req, res) => {
  // add condition when params are empty
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
    return res.status(200).json(recipesData);
  } catch (err) {
    // write am error handler
  }
});

router.post("/:id", async (req, res) => {
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
    // write am error handler
  }
});

export default router;
