"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import Galaxy from "../components/Galaxy";

type Msg = { role: "user" | "assistant"; content: string };

export default function HomePage() {
  const [history, setHistory] = useState<Msg[]>([
    { role: "assistant", content: "Greetings, carbon-based life form. I'm Grouk — like Grok, but with the emotional warmth of deep space. What cosmic mystery shall we unravel today?" }
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
    <main className="relative flex min-h-screen flex-col items-center p-3 sm:p-6 lg:p-8 overflow-hidden">
      <Galaxy 
        mouseInteraction={true}
        mouseRepulsion={true}
        density={0.8}
        glowIntensity={0.4}
        saturation={0.6}
        hueShift={220}
        speed={0.3}
        twinkleIntensity={0.5}
        rotationSpeed={0.02}
        transparent={false}
      />
      
      {/* Centered Logo Header */}
      <div className="relative z-10 flex flex-col items-center mt-8 sm:mt-12 mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-secondary p-1 shadow-2xl">
            <div className="h-full w-full rounded-full bg-white/95 flex items-center justify-center overflow-hidden shadow-inner">
              <img src="/logotransparent.png" alt="Grouk" className="h-12 w-12 sm:h-14 sm:w-14 object-contain filter drop-shadow-sm" />
            </div>
          </div>
          <div className="font-bold text-4xl sm:text-5xl text-white font-caveat drop-shadow-lg">Grouk</div>
        </div>
        
        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <select 
            value={mode} 
            onChange={e=>setMode(e.target.value)} 
            className="cosmic-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none bg-space-dark/50 backdrop-blur-sm border-cosmic-primary/30"
          >
            <option value="giggle">/giggle</option>
            <option value="roast_gently">/roast_cold</option>
            <option value="dadjoke">/cosmic_dad</option>
            <option value="haiku">/space_haiku</option>
            <option value="deadpan">/void_stare</option>
            <option value="serious">/mission_mode</option>
          </select>
          
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2 text-cosmic-accent">
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
            <label className="flex items-center gap-2 text-cosmic-accent">
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
        </div>
      </div>

      <div className="w-full max-w-4xl lg:max-w-5xl relative z-10 mx-auto flex-1 flex flex-col">

        <section className="cosmic-border rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[50vh] flex flex-col bg-space-dark/30 backdrop-blur-lg border-cosmic-primary/20">
          <div className="flex-1 space-y-4 sm:space-y-5 overflow-y-auto max-h-[45vh] pr-2 mb-6">
            {history.map((m, i) => (
              <div key={i} className={clsx("rounded-xl px-4 py-4 sm:px-5 sm:py-5 max-w-[90%] sm:max-w-[85%] whitespace-pre-wrap font-kalam text-sm sm:text-base leading-relaxed", 
                m.role === "user" 
                  ? "bg-cosmic-primary/15 ml-auto text-white border border-cosmic-primary/20" 
                  : "bg-cosmic-secondary/10 mr-auto text-white border border-cosmic-secondary/20"
              )}>
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <input
              className="flex-1 rounded-xl px-4 py-4 sm:px-5 sm:py-3 outline-none text-white placeholder-gray-400 font-kalam text-base bg-space-dark/50 border border-cosmic-primary/30 focus:border-cosmic-primary/60 transition-colors"
              placeholder="Query the cosmic void..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={(e)=>{ if (e.key==="Enter" && !e.shiftKey) send(); }}
            />
            <button 
              onClick={send} 
              disabled={loading} 
              className="rounded-xl px-6 py-4 sm:px-5 sm:py-3 bg-gradient-to-r from-cosmic-primary to-cosmic-secondary text-white font-medium hover:from-cosmic-secondary hover:to-cosmic-primary transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-caveat text-base sm:text-sm whitespace-nowrap border border-cosmic-primary/30"
            >
              {loading ? "Calculating..." : "Launch"}
            </button>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-gray-500 text-center font-kalam opacity-70">
            Grouk v2.0: Now with 47% more existential dread and cosmic humor.
          </p>
        </section>

        {/* Attribution */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 font-kalam opacity-60">
            Made by{' '}
            <a 
              href="https://x.com/Bonkshen2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cosmic-accent hover:text-cosmic-primary transition-colors duration-200 underline decoration-dotted underline-offset-2"
            >
              @Bonkshen2
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
