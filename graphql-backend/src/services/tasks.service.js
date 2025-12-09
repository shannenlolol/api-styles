import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask
} from "../data/tasks.store.js";

const VALID_STATUSES = new Set([
  "Open",
  "ToDo",
  "Doing",
  "Done",
  "Closed"
]);

function makeId() {
  return `T-${Date.now()}`;
}

function assertValidStatus(status) {
  if (!status) {
    return;
  }

  const ok = VALID_STATUSES.has(status);

  if (!ok) {
    const err = new Error("Invalid task status.");
    err.code = "INVALID_STATUS";
    throw err;
  }
}

function createTaskService(input) {
  assertValidStatus(input.status);

  const now = new Date().toISOString();

  const task = {
    id: makeId(),
    title: input.title,
    description: input.description || "",
    status: input.status || "Open",
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

function updateTaskService(id, input) {
  assertValidStatus(input.status);

  const patch = {
    ...input
  };

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
