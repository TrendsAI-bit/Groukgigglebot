# Grouk — Grok, but giggly

A tiny web app that parodies Grok: Grouk cracks a quick joke and then gives a helpful answer.
Built with **Next.js (App Router)**, **Tailwind**, and **OpenAI streaming**. Ready for Vercel.

## Quick start

```bash
# 1) Install
pnpm i   # or npm i / yarn

# 2) Set your key
echo "OPENAI_API_KEY=sk-..." > .env.local

# 3) Dev
pnpm dev

# 4) Build
pnpm build && pnpm start
```

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab).
2. In Vercel, **New Project** → import the repo.
3. Add env var `OPENAI_API_KEY` in Project Settings → Environment Variables.
4. Deploy. (Build command and settings auto-detected.)

## Customization

- Edit `app/api/chat/route.ts` for the system prompt and modes.
- Colors & doodle style are in `tailwind.config.ts` and `app/globals.css`.
- Logo lives in `public/grouk-logo.svg` (replace with your own).

## Notes

- Model defaults to `gpt-4o-mini`. Change in `route.ts` if you prefer another.
- This project streams plain text; feel free to switch to SSE or JSON chunks.
- Keep it kind. Grouk never punches down and drops humor for crisis/support.
