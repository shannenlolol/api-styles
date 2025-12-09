import express from "express";
import cors from "cors";
import helmet from "helmet";

import tasksRoutes from "./routes/tasks.routes.js";
import { notFoundHandler } from "./middleware/notfound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", function (req, res) {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tasks", tasksRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
