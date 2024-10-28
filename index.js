import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import recipesRoutes from "./routes/recipes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recipes", recipesRoutes);

const BACKEND_URL = process.env.BACKEND_URL;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on ${BACKEND_URL}:${PORT}`);
});
