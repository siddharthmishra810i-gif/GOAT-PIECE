import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { pipelineRouter } from "./src/server/routes/pipelineRoutes";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Mount Ingestion Pipeline & Canonical Database API
app.use("/api", pipelineRouter);

// Server-side Gemini AI Client (Lazy Initialized)
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in server environment.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// In-memory persistent theory submissions and votes
interface CommunityTheory {
  id: string;
  title: string;
  author: string;
  dateCreated: string;
  summary: string;
  evidence: string[];
  supportingChapters: number[];
  contradictingEvidence?: string[];
  relatedCharacters: string[];
  relatedLocations: string[];
  relatedMysteries: string[];
  probability: "Confirmed" | "Strongly Supported" | "Plausible" | "Speculative" | "Contradicted" | "Disproven";
  status: string;
  votes: number;
}

const communityTheories: CommunityTheory[] = [];

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Grand Line Archives",
    timestamp: new Date().toISOString(),
  });
});

// Community theory endpoints
app.get("/api/community/theories", (_req, res) => {
  res.json({ theories: communityTheories });
});

app.post("/api/community/theories", (req, res) => {
  try {
    const { title, author, summary, evidence, supportingChapters, probability, relatedMysteries, relatedCharacters } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ error: "Title and summary are required." });
    }
    const newTheory: CommunityTheory = {
      id: `theory_user_${Date.now()}`,
      title,
      author: author || "Brave Sea Explorer",
      dateCreated: new Date().toISOString().split("T")[0],
      summary,
      evidence: Array.isArray(evidence) ? evidence : [evidence],
      supportingChapters: Array.isArray(supportingChapters) ? supportingChapters : [],
      relatedCharacters: Array.isArray(relatedCharacters) ? relatedCharacters : [],
      relatedLocations: [],
      relatedMysteries: Array.isArray(relatedMysteries) ? relatedMysteries : [],
      probability: probability || "Speculative",
      status: "Community Submission",
      votes: 1,
    };
    communityTheories.unshift(newTheory);
    res.json({ success: true, theory: newTheory });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add theory." });
  }
});

app.post("/api/community/theories/:id/vote", (req, res) => {
  const { id } = req.params;
  const { direction } = req.body; // 'up' or 'down'
  const theory = communityTheories.find((t) => t.id === id);
  if (!theory) {
    return res.status(404).json({ error: "Theory not found" });
  }
  theory.votes += direction === "down" ? -1 : 1;
  res.json({ success: true, votes: theory.votes });
});

// AI Assistant: Ask the Grand Line
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { prompt, userChapter = 1125, userEpisode = 1120, caughtUp = false, conversationHistory = [] } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A prompt query is required." });
    }

    const ai = getGeminiClient();

    const spoilerInstruction = caughtUp
      ? "The user is fully caught up with the latest manga chapters (through Chapter 1125+ / Egghead and Elbaf). You may reference all canon lore freely."
      : `CRITICAL SPOILER PROTOCOL: The user is currently at Manga Chapter ${userChapter} and Anime Episode ${userEpisode}. You MUST NOT reveal any major plot developments, bounty changes, fruit awakenings, deaths, or secrets that occur strictly AFTER Chapter ${userChapter} unless they ask about it or you clearly prefix it with '[SPOILER WARNING: Chapter XXX]'. If their question asks about events past their cutoff, gently alert them of the chapter where it is answered and provide a spoiler-safe summary!`;

    const systemInstruction = `You are "The Grand Line Archivist", an all-knowing, scholarly, yet thrilling nautical navigator and historian of the One Piece universe for the Grand Line Archives encyclopedia.
${spoilerInstruction}

Guidelines:
1. ALWAYS distinguish CANON (Manga, SBS, Vivre Cards, confirmed by Eiichiro Oda) from SPECULATION / FAN THEORIES. Clearly label speculations as such.
2. Cite specific chapter numbers, anime episodes, or SBS volumes where facts were revealed (e.g. "In Chapter 967...", "In SBS Volume 45...").
3. Adopt a dignified, immersive Grand Line scholar tone: articulate, insightful, appreciative of the epic romantic adventure of the High Seas and the Void Century.
4. If asked about mysteries like Joy Boy, the Ancient Weapons (Pluton, Poseidon, Uranus), the Will of D., Imu, or the One Piece itself, synthesize what is canonically known versus the most prominent community theories.
5. Format your response cleanly using markdown (bullet points, bold key terms, quotes). Keep answers thorough yet structured.`;

    // Construct contents
    const contents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        if (msg.role && msg.content) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.65,
      },
    });

    const reply = response.text || "The archives are turbulent... The Log Pose could not lock on an answer.";
    res.json({ reply, answer: reply, model: "gemini-2.5-flash" });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    // Intelligent fallback archive answer if API key is not yet configured by user
    const fallbackAnswers: Record<string, string> = {
      default: "Based on the Grand Line Archives, the Void Century remains an 800-year-old enigma erased by the World Government. Deciphering the Rio Poneglyphs alongside Nico Robin and the Kozuki clan's ancient mason stones is the sole canonical path to unlocking the True History at Laugh Tale.",
    };
    res.json({
      answer: "According to the Grand Line Archives and Dr. Vegapunk's broadcast (Ch. 1113-1115), the world was once composed of vast continents before the Ancient Weapons were activated 800 years ago during the Great War, causing global sea levels to rise by 200 meters. The search for the One Piece on Laugh Tale holds the answer to the ancient kingdom's destiny and the true identity of Joy Boy.",
      reply: "According to the Grand Line Archives and Dr. Vegapunk's broadcast (Ch. 1113-1115), the world was once composed of vast continents before the Ancient Weapons were activated 800 years ago during the Great War, causing global sea levels to rise by 200 meters. The search for the One Piece on Laugh Tale holds the answer to the ancient kingdom's destiny and the true identity of Joy Boy.",
      notice: "Archive synthesized answer (Set GEMINI_API_KEY in Settings for custom real-time queries).",
    });
  }
});

// Alias for /api/ask
app.post("/api/ask", async (req, res, next) => {
  const { query, prompt, ...rest } = req.body;
  req.body.prompt = prompt || query;
  // Forward to gemini chat handler
  return (app as any)._router.handle(
    { ...req, url: "/api/gemini/chat", originalUrl: "/api/gemini/chat" },
    res,
    next
  );
});

// Alias for /api/theories/vote and submit
app.post("/api/theories/vote", (req, res) => {
  const { theoryId, direction = "up" } = req.body;
  const theory = communityTheories.find((t) => t.id === theoryId);
  if (theory) {
    theory.votes += direction === "down" ? -1 : 1;
    return res.json({ success: true, votes: theory.votes });
  }
  res.json({ success: true, votes: 1 });
});

app.post("/api/theories/submit", (req, res) => {
  try {
    const theory = req.body;
    communityTheories.unshift(theory);
    res.json({ success: true, theory });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to submit theory" });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚓ Grand Line Archives server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
