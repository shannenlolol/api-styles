import {
  createTaskService,
  listTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService
} from "../services/tasks.service.js";

function toGraphQLError(err) {
  if (err && err.code === "INVALID_STATUS") {
    return new Error("Status must be one of Open, ToDo, Doing, Done, Closed.");
  }

  return err;
}

export const resolvers = {
  Query: {
    tasks: async function () {
      return listTasksService();
    },

    task: async function (_, args) {
      return getTaskService(args.id);
    }
  },

  Mutation: {
    createTask: async function (_, args) {
      try {
        return createTaskService(args.input);
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    updateTask: async function (_, args) {
      try {
        return updateTaskService(args.id, args.input);
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    deleteTask: async function (_, args) {
      return deleteTaskService(args.id);
    }
  }
};
