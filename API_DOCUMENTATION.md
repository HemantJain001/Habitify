# AttackMode API Documentation

## Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user (handled by NextAuth)
- `GET /api/auth/session` - Get current session (handled by NextAuth)

## User Management
- `GET /api/user/profile` - Get current user profile and stats
- `GET /api/user/stats` - Get user statistics in frontend format

## Tasks
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task (including completion status)
- `DELETE /api/tasks/[id]` - Delete task

## Power System Todos
- `GET /api/power-system` - Get power system todos (supports ?category=brain|muscle|money&date=YYYY-MM-DD)
- `POST /api/power-system` - Create new power system todo
- `PUT /api/power-system/[id]` - Update power system todo
- `DELETE /api/power-system/[id]` - Delete power system todo

## Journal Entries
- `GET /api/journal` - Get journal entries (supports ?date=YYYY-MM-DD&limit=10)
- `POST /api/journal` - Create new journal entry
- `GET /api/journal/[id]` - Get specific journal entry
- `PUT /api/journal/[id]` - Update journal entry
- `DELETE /api/journal/[id]` - Delete journal entry

## Problem Solving
- `GET /api/problems` - Get problem solving entries (supports ?category=&limit=10)
- `POST /api/problems` - Create new problem solving entry

## Behaviors
- `GET /api/behaviors` - Get behavior entries (supports ?date=YYYY-MM-DD&limit=10)
- `POST /api/behaviors` - Create new behavior entry

## Example API Calls

### Create a Task
```javascript
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Learn React'
  })
})
```

### Complete a Task
```javascript
fetch('/api/tasks/task-id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    completed: true
  })
})
```

### Create a Journal Entry
```javascript
fetch('/api/journal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2025-06-28',
    notes: 'Had a great day today. Completed 3 tasks and felt very productive.',
    mood: 8
  })
})
```

### Create a Power System Todo
```javascript
fetch('/api/power-system', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Read programming book',
    category: 'brain',
    date: '2025-06-28'
  })
})
```

## Authentication
All API routes (except `/api/auth/*`) require authentication via NextAuth session.

## Error Handling
All routes return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Database Integration
All routes use Prisma ORM for type-safe database operations with PostgreSQL.
