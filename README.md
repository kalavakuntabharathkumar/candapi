# Candidate Application REST API and Data Platform

Express + PostgreSQL API with normalized candidate, job, application, resume, and event data; Redis/BullMQ asynchronous resume-processing jobs; OpenAPI/Swagger docs; Mocha/Supertest tests; Docker Compose; and Jenkins pipeline example.

## Run with Docker

```bash
docker compose up --build
```

API: `http://localhost:3000`, docs: `http://localhost:3000/docs`, health: `http://localhost:3000/health`.

## Run without Docker

Use Node.js 20+, PostgreSQL, and Redis. Copy `.env.example` to `.env`, install dependencies with `npm install`, run `npm run migrate`, then `npm run dev`. Set `RUN_WORKER=true` in another terminal to start the BullMQ worker.

## API coverage

The API exposes 24 route operations across health, jobs, candidates, applications, resumes, and metrics. Resume parsing is represented by a deterministic demo processor; connect a vetted parser and object-storage adapter for production. AWS and latency/throughput figures in the source project brief are targets/claims and are not independently benchmarked by this sample implementation.
