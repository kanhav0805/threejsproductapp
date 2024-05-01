//setting up regular express server
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import dalleRoutes from "./routes/dalle.routes.js";

dotenv.config(); //to get the env file

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

//use the dalle routes
app.use("/api/v1/dalle", dalleRoutes);

//now a dummy route to know the server is started
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from DALLE.ai" });
});

//to listen on specific port
app.listen(8080, () => console.log("Server has started on port 8080"));
