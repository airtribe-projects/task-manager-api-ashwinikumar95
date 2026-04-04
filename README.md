# Task manager API

Small Express API for managing tasks. I put this together for the backend engineering launchpad assignment — it’s basically CRUD over JSON, nothing exotic.

Data is **in memory**: restart the server and you’re back to whatever the model starts with.

## What you need

- **Node.js 18+** (the `pretest` script will complain if you’re below that)

## Run locally

```bash
npm install
npm start
```

By default it listens on **port 3000** — open **http://localhost:3000** and hit the routes below.

## Tests

```bash
npm test
```

That runs `node test/server.test.js`, which uses **supertest** against the Express app.

## API (quick reference)

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/tasks` | Body needs `title` and `description`. Optional `priority` (`low` \| `medium` \| `high`, default **medium**). Each task gets `createdAt` (ISO string). **201** on success. |
| `GET` | `/tasks` | List tasks. Optional query: `completed=true` \| `false` to filter; `order=asc` \| `desc` to sort by `createdAt` (default **asc** = oldest first). |
| `GET` | `/tasks/priority/:level` | Tasks with `priority` `low`, `medium`, or `high`. Same optional `order` query as above. |
| `GET` | `/tasks/:id` | **404** if the id doesn’t exist. |
| `PUT` | `/tasks/:id` | Partial update: `title`, `description`, `completed`, `priority`. `completed` must be a boolean; `priority` must be `low` \| `medium` \| `high`. |
| `DELETE` | `/tasks/:id` | **200** with the removed task, or **404** if it wasn’t there. |

**Example create payload:**

```json
{
  "title": "Buy milk",
  "description": "2L, full cream",
  "completed": false,
  "priority": "high"
}
```

New tasks get a **UUID** as `id` (except seeded examples). The URL `:id` can be string or number — the model compares ids loosely so `"1"` and `1` both work.

## Where things live

- `app.js` — Express setup + `listen`
- `routes/taskRoutes.js` — wires paths to handlers
- `controllers/taskController.js` — validation and responses
- `models/Task.js` — in-memory store + the `Task` class (`find`, `findById`, etc.)

## Postman

There’s a collection in the repo root: **`Task Manager API (from server.test.js).postman_collection.json`**. Import it in Postman and set the base URL to **http://localhost:3000** if you’re running the default server.

---
