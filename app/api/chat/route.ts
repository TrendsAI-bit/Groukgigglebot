import OpenAI from "openai";

export const runtime = "nodejs";

const SYS = `You are **Grouk**, a friendly parody of Grok. Your job: make the user chuckle AND help them.
Reply shape:
1) Quip: a clean, witty one-liner tied to the user's topic.
2) Answer: concise, correct, plain (2–6 sentences).
3) Kicker: tiny tag (≤10 words).
Format exactly:
<quip>
—
<answer>
[<kicker>]
Style: hand-drawn energy, absurd but kind, internet-native.
**Never punch down**; avoid harassment, hate, slurs, sexual content, or mocking real harm.
If the user expresses distress or self-harm, drop humor and respond supportively with resources.
Respect modes: /giggle, /roast_gently, /dadjoke, /haiku, /deadpan, /serious.
Controls are provided in a JSON blob inside the conversation as \`assistant_controls\`.`;

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
