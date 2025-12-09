import React, { useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const STATUSES = ["Open", "ToDo", "Doing", "Done", "Closed"];

const LIST_TASKS = gql`
  query ListTasks {
    tasks {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      updatedAt
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export default function TasksGraphql() {
  const { data, loading, error } = useQuery(LIST_TASKS, {
    fetchPolicy: "cache-and-network"
  });

  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const tasks = data && data.tasks ? data.tasks : [];

  const tasksByStatus = useMemo(function () {
    const map = new Map();

    for (const s of STATUSES) {
      map.set(s, []);
    }

    for (const t of tasks) {
      const arr = map.get(t.status) || map.get("Open");
      arr.push(t);
    }

    return map;
  }, [tasks]);

  async function createTask() {
    const trimmed = title.trim();

    if (!trimmed) {
      return;
    }

    await createTaskMutation({
      variables: {
        input: {
          title: trimmed,
          description: description.trim(),
          status: "Open"
        }
      },
      refetchQueries: [{ query: LIST_TASKS }]
    });

    setTitle("");
    setDescription("");
  }

  async function updateStatus(taskId, status) {
    await updateTaskMutation({
      variables: {
        id: taskId,
        input: { status }
      },
      refetchQueries: [{ query: LIST_TASKS }]
    });
  }

  async function remove(taskId) {
    await deleteTaskMutation({
      variables: { id: taskId },
      refetchQueries: [{ query: LIST_TASKS }]
    });
  }

  return (
    <div className="container">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>
              Tasks (GraphQL)
            </div>
            <div className="small">
              React client calling http://localhost:3001/graphql
            </div>
          </div>

          <div className="row">
            <input
              className="input"
              value={title}
              onChange={function (e) { setTitle(e.target.value); }}
              placeholder="Task title"
            />
            <input
              className="input"
              value={description}
              onChange={function (e) { setDescription(e.target.value); }}
              placeholder="Optional description"
            />
            <button
              type="button"
              className="button"
              onClick={createTask}
            >
              Add
            </button>
          </div>
        </div>

        {error ? (
          <div className="small" style={{ color: "#b91c1c", marginTop: 10 }}>
            {error.message}
          </div>
        ) : null}
      </div>

      <div style={{ height: 14 }} />

      <div className="column-grid">
        {STATUSES.map(function (status) {
          const items = tasksByStatus.get(status) || [];

          return (
            <div key={status} className="card">
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                {status}
              </div>

              {loading ? (
                <div className="small">Loading…</div>
              ) : null}

              <div className="row" style={{ flexDirection: "column" }}>
                {items.map(function (t) {
                  return (
                    <div key={t.id} className="task">
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {t.title}
                      </div>
                      <div className="small">
                        {t.description || "—"}
                      </div>

                      <div className="row" style={{ marginTop: 8 }}>
                        <select
                          className="input"
                          style={{ minWidth: 0, padding: "6px 8px", fontSize: 12 }}
                          value={t.status}
                          onChange={function (e) {
                            updateStatus(t.id, e.target.value);
                          }}
                        >
                          {STATUSES.map(function (s) {
                            return (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            );
                          })}
                        </select>

                        <button
                          type="button"
                          className="button secondary"
                          onClick={function () { remove(t.id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

                {!loading && items.length === 0 ? (
                  <div className="small">No tasks</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
