import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  HelpCircle,
  Lightbulb,
  Cpu,
  RotateCcw,
} from "lucide-react";
import { useSpoiler } from "../context/SpoilerContext";

interface Message {
  id: string;
  role: "user" | "scholar";
  content: string;
  timestamp: string;
}

export const AiScholar: React.FC = () => {
  const { userMangaChapter, userAnimeEpisode, showAllSpoilers } = useSpoiler();

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "scholar",
      content: `Greetings, voyager! I am connected to Punk Records and the Grand Line Archives. Your current voyage is calibrated to Manga Chapter ${userMangaChapter}. Any inquiry you formulate will be analyzed strictly within your authorized knowledge clearance to prevent accidental spoilers. What mystery shall we explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickPrompts = [
    "What are the 3 Ancient Weapons and what is known about them?",
    "Explain the mechanics of Devil Fruit Awakening.",
    "Who are the Lunarians and Buccaneers?",
    "What is the Will of D. and who bears the initial?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          userChapter: userMangaChapter,
          userEpisode: userAnimeEpisode,
          showSpoilers: showAllSpoilers,
        }),
      });

      const data = await response.json();

      const scholarMsg: Message = {
        id: `sch_${Date.now()}`,
        role: "scholar",
        content: data.answer || "The records for this question are presently sealed in the Void Century.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, scholarMsg]);
    } catch (err) {
      // Fallback archive response if network unavailable
      const fallbackMsg: Message = {
        id: `sch_${Date.now()}`,
        role: "scholar",
        content: `Archive Consultation Report: Based on your clearance at Chapter ${userMangaChapter}, inquiries regarding "${textToSend}" are cataloged under Grand Line ancient historical events. For optimal immersion, cross-reference our Mysteries tab and Knowledge Graph.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-amber-100">
              Archives AI Scholar (Punk Records Link)
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Spoiler-Protected Neural Retrieval System · Clearance: Chapter {userMangaChapter}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Spoiler Shield Active</span>
        </div>
      </div>

      {/* Chat Log Window */}
      <div className="p-6 rounded-2xl bg-[#081223] border border-slate-800 shadow-2xl h-[460px] flex flex-col justify-between">
        {/* Messages */}
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isScholar = msg.role === "scholar";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isScholar ? "" : "flex-row-reverse space-x-reverse"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isScholar
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-700"
                      : "bg-amber-600 text-slate-950 font-bold"
                  }`}
                >
                  {isScholar ? "Ω" : "U"}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isScholar
                      ? "bg-[#0c1c38] border border-cyan-500/20 text-slate-200"
                      : "bg-amber-500 text-slate-950 font-medium"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      isScholar ? "text-slate-400" : "text-amber-950"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cyan-300 font-mono p-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Vegapunk's satellite antenna transmitting from Egghead...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Queries */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-amber-200 transition-colors truncate max-w-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything about characters, lore, or theories..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Scholar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
