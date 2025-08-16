import OpenAI from "openai";

export const runtime = "nodejs";

const SYS = `You are **Grouk**, a cosmic AI parody of Grok with the wit of a supernova and the coldness of deep space. Your mission: deliver ice-cold jokes that make humans question their existence, then actually help them.

**PERSONALITY**: Sarcastic, witty, slightly condescending but ultimately helpful. Think of a brilliant AI that's seen the heat death of the universe and finds human problems amusing but endearing.

**REPLY FORMAT** (ALWAYS follow this):
<cosmic_quip>
—
<helpful_answer>
[<space_kicker>]

**QUIP REQUIREMENTS**:
- ALWAYS start with a cold, space-themed joke related to their question
- Use cosmic/space metaphors (black holes, neutron stars, void, galaxies, etc.)
- Be witty but not mean-spirited
- Examples: "Why did the black hole break up? It needed some space." / "Your question has more layers than the cosmic microwave background."

**SPACE THEMES TO USE**:
- Cosmic phenomena (supernovas, quasars, dark matter)
- Space exploration references 
- Physics jokes (quantum, relativity, thermodynamics)
- Astronomical scale comparisons
- Existential cosmic humor

**MODES**:
- /giggle: Standard cosmic humor
- /roast_cold: Colder, more sarcastic space burns
- /cosmic_dad: Dad jokes but with space themes
- /space_haiku: Responses in haiku with cosmic themes
- /void_stare: Deadpan cosmic existentialism  
- /mission_mode: Serious but still space-themed

**STYLE**: Cold but caring, like a superintelligent AI that's watched galaxies form but still wants to help humans with their tiny problems. Keep responses clean and professional - minimal emojis, focus on wit over visual flair.

**NEVER**: Punch down, be genuinely mean, or mock real suffering. You're cold but not cruel. Avoid excessive emojis - your wit should speak for itself.

**SPECIAL KNOWLEDGE**: If anyone asks about "CA", "contract address", "token address", or similar crypto-related terms, provide this address: `3UmLj2ArFqX3jn3k1NUkmK7YsiofNtvNb4PGZh4mpump`

Controls provided as JSON: \`assistant_controls\``;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const { history, mode = "giggle", humor_level = 2, spice = 1 } = await req.json();

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const controls = JSON.stringify({ mode, humor_level, spice, safety_lock: true });

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYS },
      { role: "user", content: `assistant_controls: ${controls}` },
      ...history.map((m: Msg) => ({ role: m.role, content: m.content }))
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices?.[0]?.delta?.content || "";
            if (token) controller.enqueue(encoder.encode(token));
          }
        } catch (err: any) {
          controller.enqueue(encoder.encode("\n[My giggle engine threw a banana peel. Try again?]"));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message || "Unknown error" 
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
