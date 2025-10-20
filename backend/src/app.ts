import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from './modules/user/user.routes';


import { EnvConfig } from "./config/env";

const app = express();

app.use(
  cors({
    origin: EnvConfig.origins.split(","),
    methods: ["POST", "GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: "*",
    credentials: true,
    maxAge: 3600,
  })
);
app.use(express.json());

app.get("/test", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "this is testing",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

app.use('/api/user', userRoutes);


export default app;
