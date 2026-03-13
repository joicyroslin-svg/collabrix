export default async function handler(req, res) {
  // Basic CORS for local file:// and remote use
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ error: 'Task is required' });
  }

  console.log("Received task:", task);

  // Use Groq API with your key from env
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "Missing GROQ_API_KEY environment variable." });
  }
  
  // Create abort controller for timeout (25 seconds)
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
              content: "You are ChatGPT, a helpful and friendly AI assistant. Be conversational, engaging, and provide detailed answers to any question. Don't be overly formal - act like a smart friend who happens to know a lot. You can help with coding, writing, brainstorming, explaining concepts, or just chatting. Always be helpful and try to go above and beyond in your responses."
            },
            {
              role: "user",
              content: task
            }
          ],
          temperature: 0.9,
          max_tokens: 2000,
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
      throw new Error("Empty response from Groq API");
    }

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("AI Error:", error.message);
    return res.status(500).json({ error: "AI service temporarily unavailable. Please try again." });
  }
}
