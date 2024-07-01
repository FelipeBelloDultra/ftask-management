import express from "express";

import { Routes } from "./routes";

export const app = express();
const { router } = new Routes();

app.use(express.json());
app.use("/api", router);
