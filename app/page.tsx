"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

type Msg = { role: "user" | "assistant"; content: string };

export default function HomePage() {
  const [history, setHistory] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I'm Grouk — Grok, but giggly. Ask me anything 😄" }
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
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/grouk-logo.svg" alt="Grouk" className="h-10 w-10 doodle rounded-full bg-white p-1" />
            <div className="font-bold text-xl">Grouk</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <select value={mode} onChange={e=>setMode(e.target.value)} className="doodle rounded-blob px-3 py-2">
              <option value="giggle">/giggle</option>
              <option value="roast_gently">/roast_gently</option>
              <option value="dadjoke">/dadjoke</option>
              <option value="haiku">/haiku</option>
              <option value="deadpan">/deadpan</option>
              <option value="serious">/serious</option>
            </select>
            <label className="hidden sm:flex items-center gap-1">humor
              <input type="range" min={0} max={3} value={humor} onChange={e=>setHumor(parseInt(e.target.value))} />
            </label>
            <label className="hidden sm:flex items-center gap-1">spice
              <input type="range" min={0} max={2} value={spice} onChange={e=>setSpice(parseInt(e.target.value))} />
            </label>
          </div>
        </header>

        <section className="doodle rounded-blob p-4 md:p-6 bg-white">
          <div className="space-y-3">
            {history.map((m, i) => (
              <div key={i} className={clsx("rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-wrap", 
                m.role === "user" ? "bg-sky/50 ml-auto border-2 border-ink" : "bg-capy/60 mr-auto border-2 border-ink"
              )}>
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 doodle rounded-blob px-4 py-3 outline-none"
              placeholder="Ask me anything…"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={(e)=>{ if (e.key==="Enter" && !e.shiftKey) send(); }}
            />
            <button onClick={send} disabled={loading} className="doodle rounded-blob px-5 py-3 bg-capy wobble disabled:opacity-60">
              {loading ? "Thinking…" : "Send"}
            </button>
          </div>

          <p className="mt-3 text-xs opacity-70">
            By using Grouk you agree to our pleasant lack of refunds for groans. Not financial, medical, or legal advice.
          </p>
        </section>
      </div>
    </main>
  );
}
