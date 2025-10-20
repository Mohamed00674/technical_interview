import app from "./app";
import { connectDB } from "./config/database";
import { EnvConfig } from "./config/env";
import { ERROR_MAP } from "./middlewares/errorHandler";
import _logger from "./middlewares/logger";

connectDB().then(
  () => {
    app.listen(EnvConfig.port, () => {
      console.log(
        ` Server running on port ${EnvConfig.host}:${EnvConfig.port}`
      );
    });
  },
  (reason) => {
    const error = ERROR_MAP.DATABASE_ERROR;

    console.log(" Failed to connect to database", {
      error,
      reason,
    });

    throw error;
  }
);
