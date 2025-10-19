import mongoose from "mongoose";

import { EnvConfig } from "./env";

export const connectDB = async () => {
  await mongoose.connect(EnvConfig.mongoUri!);

  console.log(" Database connected");
};
