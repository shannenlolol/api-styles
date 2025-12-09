import React, { useEffect, useMemo, useState } from "react";

const STATUSES = ["Open", "ToDo", "Doing", "Done", "Closed"];

function api(path) {
  const base = "http://localhost:3000";
  return `${base}${path}`;
}

export default function TasksRest() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErrorText("");

    try {
      const response = await fetch(api("/api/tasks"), {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Failed to load tasks (${response.status}).`);
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorText(err && err.message ? err.message : "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function createTask() {
    const trimmed = title.trim();

    if (!trimmed) {
      setErrorText("Title is required.");
      return;
    }

    setErrorText("");

    try {
      const response = await fetch(api("/api/tasks"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          title: trimmed,
          description: description.trim(),
          status: "Open"
        })
      });

      if (response.status !== 201) {
        throw new Error(`Failed to create task (${response.status}).`);
      }

      const created = await response.json();
      setTasks(function (prev) {
        return [created, ...prev];
      });

      setTitle("");
      setDescription("");
    } catch (err) {
      setErrorText(err && err.message ? err.message : "Failed to create task.");
    }
  }

  async function updateStatus(taskId, status) {
    setErrorText("");

    try {
      const response = await fetch(api(`/api/tasks/${taskId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update task (${response.status}).`);
      }

      const updated = await response.json();
      setTasks(function (prev) {
        return prev.map(function (t) {
          if (t.id === updated.id) {
            return updated;
          }
          return t;
        });
      });
    } catch (err) {
      setErrorText(err && err.message ? err.message : "Failed to update task.");
    }
  }

  async function remove(taskId) {
    setErrorText("");

    try {
      const response = await fetch(api(`/api/tasks/${taskId}`), {
        method: "DELETE"
      });

      if (response.status !== 204) {
        throw new Error(`Failed to delete task (${response.status}).`);
      }

      setTasks(function (prev) {
        return prev.filter(function (t) {
          return t.id !== taskId;
        });
      });
    } catch (err) {
      setErrorText(err && err.message ? err.message : "Failed to delete task.");
    }
  }

  useEffect(function () {
    load();
  }, []);

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

  return (
    <div className="container">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>
              Tasks (REST)
            </div>
            <div className="small">
              React client calling http://localhost:3000/api/tasks
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

        {errorText ? (
          <div className="small" style={{ color: "#b91c1c", marginTop: 10 }}>
            {errorText}
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
