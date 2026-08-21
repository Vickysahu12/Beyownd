import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { ApiResponse } from "./utils/ApiResponse";
import { errorHandler } from "./middlewares/errorHandler.middleware";

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

// 404 handler — koi bhi route match na ho to
app.use((req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: `Route ${req.originalUrl} not found`,
    data: null,
  });
});

// Global error handler — sabse last mein hona zaroori hai
app.use(errorHandler);

export default app;