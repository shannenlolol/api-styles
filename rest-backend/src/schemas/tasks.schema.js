import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().max(500).optional(),
  status: z.enum(["Open", "ToDo", "Doing", "Done", "Closed"]).default("Open")
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["Open", "ToDo", "Doing", "Done", "Closed"]).optional()
});

export {
  createTaskSchema,
  updateTaskSchema
};
