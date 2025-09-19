const express = require("express");
const router = express.Router();
const { validateTaskPayload, ALLOWED_STATUS } = require("../utils/validate");

let tasks = [];
let nextId = 1;

router.get("/", (req, res) => {
  let filteredTasks = [...tasks];
  if (req.query.status) {
    if (!ALLOWED_STATUS.includes(req.query.status)) {
      return res.status(400).json({ error: "Invalid status filter." });
    }
    filteredTasks = filteredTasks.filter(t => t.status === req.query.status);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || filteredTasks.length;
  const start = (page - 1) * limit;
  res.json({
    page,
    limit,
    total: filteredTasks.length,
    tasks: filteredTasks.slice(start, start + limit),
  });
});

router.get("/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json(task);
});

router.post("/", (req, res) => {
  const errors = validateTaskPayload(req.body || {});
  if (errors.length) return res.status(400).json({ errors });
  const task = {
    id: nextId++,
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    status: ALLOWED_STATUS.includes(req.body.status) ? req.body.status : "pending",
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

router.put("/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found." });
  const errors = validateTaskPayload(req.body || {}, true);
  if (errors.length) return res.status(400).json({ errors });
  if (req.body.title) task.title = req.body.title.trim();
  if (req.body.description) task.description = req.body.description.trim();
  if (req.body.status && ALLOWED_STATUS.includes(req.body.status)) task.status = req.body.status;
  res.json(task);
});

router.delete("/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found." });
  const deletedTask = tasks.splice(index, 1)[0];
  res.json({ deleted: deletedTask });
});

module.exports = router;
