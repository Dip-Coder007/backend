const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

module.exports = app;
