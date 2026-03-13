# Backend quick start

Setup
- `cd backend`
- `cp .env.example .env` (or copy manually) and set `OPENAI_API_KEY`.
- `npm install`

Run
- `npm start` (or `PORT=5001 npm start` to change the port).
- UI is served from the project root at `http://localhost:5000/` once the server is running.

Test
- Health check: `curl http://localhost:5000/health`
- Home page: open `http://localhost:5000/` in your browser.
- POST example (bash): `curl -X POST http://localhost:5000/ai-task -H "Content-Type: application/json" -d '{"task":"Plan a weekly meal prep"}'`
- POST example (PowerShell):  
  ```powershell
  $body = @{ task = "Plan a weekly meal prep" } | ConvertTo-Json
  Invoke-RestMethod -Uri http://localhost:5000/ai-task -Method Post -Body $body -ContentType "application/json"
  ```

Free local AI option (no OpenAI billing)
- Install Ollama (Windows): `winget install Ollama.Ollama` (then log out/in once).
- Download a model, e.g.: `ollama run mistral` (first run pulls it).
- Set in `.env`:  
  ```
  OLLAMA_MODEL=mistral
  # optional: OLLAMA_HOST=http://localhost:11434
  ```
- Restart server. If OpenAI is unavailable or out of quota, the backend will auto-fall back to the local Ollama model; otherwise it returns a built-in mock plan.
