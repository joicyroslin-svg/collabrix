import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Groq API Key (set in .env)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY. Set it in backend/.env");
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chat endpoint - Uses Groq API for ChatGPT-like responses
// Using the more powerful model for better responses
app.post("/ai-task", async (req, res) => {
  const { task } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }

  console.log("Received task:", task.substring(0, 50));

  // Create abort controller for timeout (25 seconds - more time for better responses)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  
  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are ChatGPT, a helpful and friendly AI assistant. Be conversational, engaging, and provide detailed answers to any question. Don't be overly formal - act like a smart friend who happens to know a lot. You can help with coding, writing, brainstorming, explaining concepts, having philosophical discussions, or just chatting. Always be helpful and try to go above and beyond in your responses."
            },
            {
              role: "user",
              content: task
            }
          ],
          temperature: 0.9,
          max_tokens: 2000,
          top_p: 0.95
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq API error: ${groqResponse.status} - ${errorText}`);
    }

    const groqData = await groqResponse.json();
    
    if (groqData.choices && groqData.choices[0]?.message?.content) {
      console.log("Groq API success!");
      return res.json({ result: groqData.choices[0].message.content });
    } else {
      throw new Error("No response content from Groq");
    }

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("AI Error:", error.message);
    return res.status(500).json({ error: "AI service temporarily unavailable. Please try again." });
  }
});

// Simple endpoints
app.post("/ai-summary", async (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }
  const summary = `📌 ${task.substring(0, 50)}${task.length > 50 ? '...' : ''}`;
  return res.json({ result: summary });
});

app.post("/ai-subtasks", async (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }
  const subtasks = `1. Research: ${task}\n2. Plan the approach\n3. Execute main work\n4. Test results\n5. Review and finalize`;
  return res.json({ result: subtasks });
});

app.post("/ai-time-estimate", async (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }
  return res.json({ result: "⏱️ Estimated: 2-4 hours\n\n📊 Breakdown:\n- Planning: 30 min\n- Execution: 2-3 hours\n- Review: 30 min" });
});

app.post("/ai-deadline", async (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  const dateStr = deadline.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return res.json({ result: `📅 Deadline: ${dateStr}\n\n⏰ Tips:\n- Break into daily goals\n- Start early` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AI Server running on port ${PORT}`);
});
