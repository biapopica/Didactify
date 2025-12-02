import "dotenv/config";
import express from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
