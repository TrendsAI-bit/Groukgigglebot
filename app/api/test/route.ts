export async function GET() {
  return Response.json({
    message: "API is working",
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) + "...",
    timestamp: new Date().toISOString()
  });
}
