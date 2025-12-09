from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class TaskModel:
    id: str
    title: str
    description: str
    status: int
    created_at: str
    updated_at: str


class TaskStore:
    def __init__(self) -> None:
        self._tasks: Dict[str, TaskModel] = {}
        self._counter: int = 0

    def list_tasks(self) -> List[TaskModel]:
        return list(self._tasks.values())

    def get_task(self, task_id: str) -> Optional[TaskModel]:
        return self._tasks.get(task_id)

    def create_task(self, title: str, description: str, status: int) -> TaskModel:
        self._counter = self._counter + 1
        task_id = f"T-{self._counter}"
        ts = now_iso()

        model = TaskModel(
            id=task_id,
            title=title,
            description=description,
            status=status,
            created_at=ts,
            updated_at=ts
        )

        self._tasks[task_id] = model
        return model

    def update_task(self, task_id: str, title: str, description: str, status: int) -> Optional[TaskModel]:
        existing = self._tasks.get(task_id)

        if existing is None:
            return None

        if title:
            existing.title = title

        if description:
            existing.description = description

        if status:
            existing.status = status

        existing.updated_at = now_iso()
        self._tasks[task_id] = existing
        return existing

    def delete_task(self, task_id: str) -> bool:
        if task_id not in self._tasks:
            return False

        del self._tasks[task_id]
        return True
