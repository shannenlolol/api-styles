from __future__ import annotations

from concurrent import futures

import grpc

import tasks_pb2
import tasks_pb2_grpc
from store import TaskStore, TaskModel


def to_proto(model: TaskModel) -> tasks_pb2.Task:
    return tasks_pb2.Task(
        id=model.id,
        title=model.title,
        description=model.description,
        status=model.status,
        created_at=model.created_at,
        updated_at=model.updated_at
    )


class TaskService(tasks_pb2_grpc.TaskServiceServicer):
    def __init__(self) -> None:
        self.store = TaskStore()

    def ListTasks(self, request, context):
        models = self.store.list_tasks()
        tasks = []

        for m in models:
            tasks.append(to_proto(m))

        return tasks_pb2.ListTasksResponse(tasks=tasks)

    def GetTask(self, request, context):
        model = self.store.get_task(request.id)

        if model is None:
            context.abort(grpc.StatusCode.NOT_FOUND, "Task not found.")

        return tasks_pb2.GetTaskResponse(task=to_proto(model))

    def CreateTask(self, request, context):
        title = request.title.strip()

        if not title:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Title is required.")

        status = request.status
        if status == tasks_pb2.TASK_STATUS_UNSPECIFIED:
            status = tasks_pb2.Open

        model = self.store.create_task(
            title=title,
            description=request.description or "",
            status=status
        )

        return tasks_pb2.CreateTaskResponse(task=to_proto(model))

    def UpdateTask(self, request, context):
        model = self.store.update_task(
            task_id=request.id,
            title=request.title or "",
            description=request.description or "",
            status=request.status
        )

        if model is None:
            context.abort(grpc.StatusCode.NOT_FOUND, "Task not found.")

        return tasks_pb2.UpdateTaskResponse(task=to_proto(model))

    def DeleteTask(self, request, context):
        ok = self.store.delete_task(request.id)
        return tasks_pb2.DeleteTaskResponse(ok=ok)


def serve() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    tasks_pb2_grpc.add_TaskServiceServicer_to_server(TaskService(), server)

    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC TaskService running on port 50051")

    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == "__main__":
    serve()
