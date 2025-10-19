import { Request, Response, Router } from "express";

import * as userService from "./user.service";
import { handleCatch } from "../../middlewares/errorHandler";

const userRoutes = Router();

userRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: null,
    });
  } catch (err) {
    const appError = handleCatch(err);

    res.status(appError.statusCode).json({
      error: appError.type,
      message: appError.message,
    });
  }
});

userRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { user, token, refreshToken } = await userService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        refreshToken,
      },
    });
  } catch (err) {
    const appError = handleCatch(err);

    res.status(appError.statusCode).json({
      success: false,
      error: appError.type,
      message: appError.message,
    });
  }
});

userRoutes.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await userService.refreshToken(token);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const appError = handleCatch(err);

    res.status(appError.statusCode || 500).json({
      success: false,
      error: appError.type,
      message: appError.message,
    });
  }
});

export default userRoutes;
