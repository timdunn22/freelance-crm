# Freelance CRM

A lightweight CRM for freelancers to manage leads, track interactions, and organize tasks. Built with Rails 8 API + React 19 frontend.

## Features

- **Lead Pipeline** - Track prospects through stages: New > Contacted > Qualified > Proposal > Negotiation > Won/Lost
- **Kanban Board** - Drag-and-drop leads between pipeline stages
- **Interaction Logging** - Record emails, calls, meetings, and notes per lead
- **Task Management** - Create tasks with priorities and due dates, linked to specific leads
- **Tagging System** - Custom color-coded tags for lead categorization
- **Dashboard** - Overview stats for pipeline health and activity

## Tech Stack

**Backend:** Ruby on Rails 8.1, SQLite, Puma, JWT Auth, Solid Queue/Cache/Cable

**Frontend:** React 19, Vite 7, Tailwind CSS 4, React Router 6, Axios

**Testing:** RSpec, FactoryBot

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET | `/dashboard/stats` | Pipeline overview |
| GET | `/leads/kanban` | Kanban board data |
| PATCH | `/leads/:id/status` | Move lead between stages |
| CRUD | `/leads` | Full lead management |
| CRUD | `/leads/:id/interactions` | Log interactions |
| CRUD | `/tasks` | Task management |
| CRUD | `/tags` | Tag management |

## Setup

```bash
# Backend
cd /path/to/freelance-crm
bundle install
rails db:create db:migrate
rails server -p 3001

# Frontend
cd frontend
npm install
npm run dev
```

## Deploy

Backend deploys to Render (free tier), frontend to Vercel. See `render.yaml` for configuration.

## License

MIT
