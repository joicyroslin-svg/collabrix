# Collabrix - Task Management App

Modern realtime task management with Kanban boards, analytics, AI assistant, and Supabase sync.

## Features
- ✅ Realtime task sync
- 📊 Analytics dashboard with pie charts & progress bars
- 🏗️ Drag-drop Kanban boards
- 🤖 AI task assistant
- ⏰ Deadline reminders & countdowns
- 👥 Leader/Member roles & team chat
- 🎨 Responsive dark theme

## Screenshots
**Landing / Overview**
Top-level overview and entry points for tasks and teams.
![Landing / Overview](screenshots/01-index.png)

**Dashboard**
KPIs and progress widgets for the current workspace.
![Dashboard](screenshots/02-dashboard.png)

**Kanban Board**
Drag-and-drop workflow columns for tasks.
![Kanban Board](screenshots/03-kanban.png)

**Analytics**
Charts and completion metrics for performance.
![Analytics](screenshots/04-analytics.png)

**Profile**
User details and personal settings.
![Profile](screenshots/05-profile.png)

**Team Access**
Role and membership management for teams.
![Team Access](screenshots/06-team-access.png)

**Team Code**
Join code and team invite management.
![Team Code](screenshots/07-team-code.png)

**AI Assistant**
Full-screen AI workspace with team-wide chat and history.
![AI Assistant](screenshots/08-ai-assistant.png)

## Quick Start
1. Open `index.html` in browser
2. Signup → Set role & team code
3. Create/manage tasks

## Supabase Setup
Run `supabase-policies.sql` & `fix-tasks-table.sql` in SQL Editor.

## AI Setup
Set `GROQ_API_KEY` in your environment (local `.env` or hosting platform) to enable the AI assistant.

## Deploy
- Frontend: Static hosting (Netlify/Vercel)
- Backend: Node.js API (`backend/server.js`)

Live demo: https://collabrix-lyart.vercel.app
