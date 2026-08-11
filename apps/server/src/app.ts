import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { ApiResponse } from "./utils/ApiResponse";

const app: Application = express();

// Standard Security & Body Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, { uptime: process.uptime() }, "Server is healthy"));
});

// API Routes Mounting (Single clean mounting point)
app.use("/api/v1", routes);

export default app;