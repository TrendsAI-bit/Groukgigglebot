"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

type Msg = { role: "user" | "assistant"; content: string };

export default function HomePage() {
  const [history, setHistory] = useState<Msg[]>([
    { role: "assistant", content: "Greetings, carbon-based life form. I'm Grouk — like Grok, but with the emotional warmth of deep space. What cosmic mystery shall we unravel today? 🌌" }
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("giggle");
  const [humor, setHumor] = useState(2);
  const [spice, setSpice] = useState(1);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  async function send() {
    if (!input.trim() || loading) return;
    const newHistory: Msg[] = [...history, { role: "user" as const, content: input }];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: newHistory, mode, humor_level: humor, spice })
    });

    if (!res.ok || !res.body) {
      setHistory(h => [...h, { role: "assistant" as const, content: "Uh oh, my giggle engine sneezed. Try again?" }]);
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";
    setHistory(h => [...h, { role: "assistant" as const, content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value, { stream: true });
      setHistory(h => {
        const copy = [...h];
        copy[copy.length - 1] = { role: "assistant" as const, content: assistantText };
        return copy;
      });
    }

    setLoading(false);
  }

  return (
    <main className="cosmic-bg flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-secondary p-0.5 space-glow">
              <div className="h-full w-full rounded-full bg-space-dark flex items-center justify-center">
                <span className="text-cosmic-accent font-bold text-lg">G</span>
              </div>
            </div>
            <div className="font-bold text-xl text-white">Grouk</div>
            <div className="text-xs text-cosmic-accent bg-cosmic-primary/20 px-2 py-1 rounded-full">
              cosmic edition
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <select 
              value={mode} 
              onChange={e=>setMode(e.target.value)} 
              className="cosmic-border rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cosmic-primary"
            >
              <option value="giggle">/giggle</option>
              <option value="roast_gently">/roast_cold</option>
              <option value="dadjoke">/cosmic_dad</option>
              <option value="haiku">/space_haiku</option>
              <option value="deadpan">/void_stare</option>
              <option value="serious">/mission_mode</option>
            </select>
            <label className="hidden sm:flex items-center gap-1 text-cosmic-accent text-xs">
              humor
              <input 
                type="range" 
                min={0} 
                max={3} 
                value={humor} 
                onChange={e=>setHumor(parseInt(e.target.value))}
                className="w-16 accent-cosmic-primary"
              />
            </label>
            <label className="hidden sm:flex items-center gap-1 text-cosmic-accent text-xs">
              cold
              <input 
                type="range" 
                min={0} 
                max={2} 
                value={spice} 
                onChange={e=>setSpice(parseInt(e.target.value))}
                className="w-16 accent-cosmic-secondary"
              />
            </label>
          </div>
        </header>

        <section className="cosmic-border rounded-2xl p-4 md:p-6 space-glow">
          <div className="space-y-3">
            {history.map((m, i) => (
              <div key={i} className={clsx("rounded-xl px-4 py-3 max-w-[80%] whitespace-pre-wrap border", 
                m.role === "user" 
                  ? "bg-cosmic-primary/20 ml-auto border-cosmic-primary/30 text-white" 
                  : "bg-cosmic-secondary/10 mr-auto border-cosmic-secondary/30 text-cosmic-glow"
              )}>
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 cosmic-border rounded-xl px-4 py-3 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cosmic-primary"
              placeholder="Query the cosmic void..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={(e)=>{ if (e.key==="Enter" && !e.shiftKey) send(); }}
            />
            <button 
              onClick={send} 
              disabled={loading} 
              className="cosmic-border rounded-xl px-5 py-3 bg-gradient-to-r from-cosmic-primary to-cosmic-secondary text-white font-medium hover:from-cosmic-secondary hover:to-cosmic-primary transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating..." : "Launch"}
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500 text-center">
            🚀 Grouk v2.0: Now with 47% more existential dread and cosmic humor. Results may vary across dimensions.
          </p>
        </section>
      </div>
    </main>
  );
}
