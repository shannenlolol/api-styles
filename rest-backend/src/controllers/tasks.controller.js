import {
  createTaskService,
  listTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService
} from "../services/tasks.service.js";

async function createTaskController(req, res) {
  const task = createTaskService(req.validatedBody);
  res.status(201).json(task);
}

async function listTasksController(req, res) {
  const tasks = listTasksService();
  res.status(200).json(tasks);
}

async function getTaskController(req, res) {
  const id = req.params.id;
  const task = getTaskService(id);

  if (!task) {
    return res.status(404).json({ error: "TaskNotFound" });
  }

  res.status(200).json(task);
}

async function updateTaskController(req, res) {
  const id = req.params.id;
  const updated = updateTaskService(id, req.validatedBody);

  if (!updated) {
    return res.status(404).json({ error: "TaskNotFound" });
  }

  res.status(200).json(updated);
}

async function deleteTaskController(req, res) {
  const id = req.params.id;
  const ok = deleteTaskService(id);

  if (!ok) {
    return res.status(404).json({ error: "TaskNotFound" });
  }

  res.status(204).send();
}

export {
  createTaskController,
  listTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController
};
