export const typeDefs = `#graphql
  enum TaskStatus {
    Open
    ToDo
    Doing
    Done
    Closed
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: TaskStatus!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean!
  }
`;
