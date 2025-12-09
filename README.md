# API Styles: REST, GraphQL, gRPC

This repository contains the same **Tasks** domain implemented in three API styles:

1. REST API (Node.js + Express)
2. GraphQL API (Node.js + Express + Apollo Server)
3. gRPC service (Python)

It also includes two **React** frontends that consume:
- the REST backend (use either fetch or axios)
- the GraphQL backend (use either Apollo Client or urql, fetch/axios also can but less preferred)

Everything uses an in-memory store to keep the example simple and easy to run.
You can replace the stores with MySQL later.

---

## **Tests on Postman**
[REST API](https://www.postman.com/tms444-5343/workspace/api-styles/collection/14701527-4373fe73-0370-40a9-a951-3c25e45094a5?action=share&creator=14701527&active-environment=14701527-6d97569b-993c-4a69-a93f-42e1f433aab9)

[GraphQL](https://www.postman.com/tms444-5343/workspace/api-styles/collection/693689f70b921e2ce68028eb?action=share&creator=14701527&active-environment=14701527-6d97569b-993c-4a69-a93f-42e1f433aab9)

[gRPC](https://www.postman.com/tms444-5343/workspace/api-styles/collection/6936934f0b921e2ce680292f?action=share&creator=14701527&active-environment=14701527-6d97569b-993c-4a69-a93f-42e1f433aab9)

## Prerequisites

- Node.js 18+ (20+ recommended)
- Python 3.9+

---

## Ports

- REST backend: **3000**
- REST frontend: **5173**

- GraphQL backend: **3001**
- GraphQL frontend: **5174**

- gRPC backend: **50051**



---

## 1) REST Backend

```bash
cd rest-backend
npm install
npm run dev
```

Endpoints:
- GET    /health
- GET    /api/tasks
- GET    /api/tasks/:id
- POST   /api/tasks
- PATCH  /api/tasks/:id
- DELETE /api/tasks/:id

Base URL:
- http://localhost:3000

---

## 2) REST Frontend

```bash
cd rest-frontend
npm install
npm run dev
```

Open:
- http://localhost:5173

The frontend calls:
- http://localhost:3000/api/tasks

---





## 3) GraphQL Backend

```bash
cd graphql-backend
npm install
npm run dev
```

Health:
- http://localhost:3001/health

GraphQL:
- http://localhost:3001/graphql

---

## 4) GraphQL Frontend

```bash
cd graphql-frontend
npm install
npm run dev
```

Open:
- http://localhost:5174

The frontend calls:
- http://localhost:3001/graphql

---

## 5) gRPC Backend

```bash
cd grpc-backend
pip install -r requirements.txt

python -m grpc_tools.protoc -I . --python_out=. --grpc_python_out=. tasks.proto

python server.py
```

Server:
- localhost:50051

---

## Suggested demo order

Start backends first:

1. REST backend
2. GraphQL backend
3. gRPC backend

Then frontends:

4. REST frontend
5. GraphQL frontend

---
