const tasks = new Map();

function createTask(task) {
  tasks.set(task.id, task);
  return task;
}

function getTaskById(id) {
  return tasks.get(id) || null;
}

function getAllTasks() {
  return Array.from(tasks.values());
}

function updateTask(id, patch) {
  const existing = getTaskById(id);

  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  tasks.set(id, updated);
  return updated;
}

function deleteTask(id) {
  const existed = tasks.has(id);

  if (!existed) {
    return false;
  }

  tasks.delete(id);
  return true;
}

export {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask
};
