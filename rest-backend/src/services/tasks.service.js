import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask
} from "../data/tasks.store.js";

function makeId() {
  return `T-${Date.now()}`;
}

function createTaskService(data) {
  const now = new Date().toISOString();

  const task = {
    id: makeId(),
    title: data.title,
    description: data.description || "",
    status: data.status || "Open",
    createdAt: now,
    updatedAt: now
  };

  return createTask(task);
}

function listTasksService() {
  return getAllTasks();
}

function getTaskService(id) {
  return getTaskById(id);
}

function updateTaskService(id, patch) {
  return updateTask(id, patch);
}

function deleteTaskService(id) {
  return deleteTask(id);
}

export {
  createTaskService,
  listTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService
};
