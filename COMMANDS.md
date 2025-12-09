# Commands 

This file collects the exact commands to run each part of the repo.

## REST backend

```bash
cd rest-backend
npm install
npm run dev
```

Test:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/tasks
```

Create:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{ "title": "REST task", "description": "hello", "status": "Open" }'
```

## REST frontend

```bash
cd rest-frontend
npm install
npm run dev
```

Open:

- http://localhost:5173


## GraphQL backend

```bash
cd graphql-backend
npm install
npm run dev
```

Health:

```bash
curl http://localhost:3001/health
```

Example query (use Apollo sandbox UI in browser):

```graphql
query {
  tasks {
    id
    title
    status
  }
}
```

## GraphQL frontend

```bash
cd graphql-frontend
npm install
npm run dev
```

Open:

- http://localhost:5174


## gRPC backend

```bash
cd grpc-backend
pip install -r requirements.txt

python -m grpc_tools.protoc -I . --python_out=. --grpc_python_out=. tasks.proto

python server.py
```


