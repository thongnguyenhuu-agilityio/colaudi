# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Cờ Lau Đi

Demo game for an internal talk ("Claude cho Dev, BA và QA"): Đinh Bộ Lĩnh defeats the 12 warlords, each warlord a software-work pain point, with a shared live leaderboard (Bảng vàng). Talk to the user in Vietnamese; write code, comments and commit messages in English.

## Rules
- Plain HTML, CSS and ES modules. No framework, no bundler, no build step.
- `public/score.js` stays pure (no DOM, no network). Every scoring change gets a test in `tests/score.test.js` first.
- `api/leaderboard.js` validates every input on the server; never trust points or time from the browser.
- Never add a dependency to the runtime. Dev dependencies only (Vitest, Playwright).
- Requirements live in `docs/01-yeu-cau.md`. When a change touches a requirement, update its row in the traceability matrix (section 10).
- Never deploy production from a session: production only changes when Thong pushes `main` (Vercel auto-deploys).

## Guards and review agents
- `.githooks/pre-commit` (no runtime deps, `score.js` purity, `score.js` changes need `tests/score.test.js`, `npm test`) and `.githooks/commit-msg` (Conventional Commits, English, subject ≤ 72). `npm install` enables them via the `prepare` script (`core.hooksPath=.githooks`). Fix failures; never bypass.
- `.claude/hooks/guard-bash.mjs` (PreToolUse on Bash, wired in `.claude/settings.json`) blocks `--no-verify`, changing `core.hooksPath`, `vercel --prod`/`promote`, pushing `main` or force-pushing, and `npm run board` write commands. It matches only at command position; when changing it, rerun a case table of allowed and blocked commands.
- Agents in `.claude/agents/`: `red-team` (adversarial review, report in the format of `docs/08-red-team-review.md`, local probes only) and `pr-reviewer` (checks a diff against the rules above and runs the tests). Both are read-only.

## Commands
- `npm run dev` — local server on :3000, in-memory leaderboard (no `npm install` needed to run the game)
- `npm test` — unit + API tests (must be green before every commit)
- `npx vitest run tests/api.test.js -t "<test name>"` — one test file / one test
- `npm run test:e2e` — Playwright end-to-end tests (needs `npx playwright install chromium` once; `PW_CHROMIUM=<path>` overrides the browser binary)
- `npx playwright test -g "<test name>"` — one e2e test
- `npm run smoke -- <url> [--write]` — smoke test a deployment; `--write` exercises the write path without adding a board entry
- `npm run board -- <url> top|wipe|rm <name>|close|open` — organiser commands (ADMIN_KEY from the environment, never on the command line)

CI (`ci/test.yml`, runs `npm ci && npm test` on Node 22) is not yet under `.github/workflows/`.

## Architecture
- **Static site + one function.** `vercel.json` serves `public/` as-is and `api/leaderboard.js` as a Vercel Function exporting Web-standard `GET`/`POST`/`DELETE(Request) → Response` handlers. `scripts/dev.mjs` is a zero-dependency Node server that imports those same handlers, so local and Vercel behaviour match. Tests call the handlers directly with `new Request(...)`.
- **Shared scoring.** `public/score.js` is imported by both the browser (`public/game.js`) and the server (`api/leaderboard.js` via `../public/score.js`). Ranking is a single number: `rankValue(points, timeSec)` = points first, then faster time.
- **Server-measured time (anti-forgery).** At game start the browser POSTs `{action:'start', runId}`; the server stores the start timestamp. On submit the server computes the time itself, rejects runs faster than `MIN_RUN_SEC` (default 45) or older than `MAX_TIME_SEC`, and accepts each `runId` only once. Any `timeSec` sent by the browser is ignored.
- **Storage.** Upstash Redis over its REST `/pipeline` endpoint (`KV_REST_API_*` or `UPSTASH_REDIS_REST_*`). With no Redis and no `VERCEL_ENV` it falls back to an in-memory store (`memory()` emulates the few Redis commands used); on Vercel without Redis it refuses to run. All keys are prefixed `colaudi:<VERCEL_ENV|local>:` so preview rehearsals never touch the production board. Adding a new Redis command means also implementing it in `memory()`.
- **Browser leaderboard modes** (`lb` in `game.js`): `server` when `/api/leaderboard` answers JSON; `local` (localStorage) only when the API is absent (404/non-JSON, e.g. opening static files). A server-mode page never falls back to local storage on network errors.
- **Other env vars:** `ADMIN_KEY` (header `x-admin-key` for wipe/rm/close/open), `EVENT_CODE` (if set, submits need the code shown in the meeting), `RATE_LIMIT_PER_10_MIN`, `MIN_RUN_SEC` (e2e sets it to 5 on port 3100). `api.test.js` controls the clock with `__setNow` and clears state with `__resetMemory`.
- **Game content** (the 12 `LORDS` with questions/answers, scenes, presenter shortcuts via `?presenter`) lives in `public/game.js`; markup and all CSS in `public/index.html`.

## Conventions
- Commit messages: Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`).
- Vietnamese UI copy and API error messages; keep it short and in the game's voice.
- Historical facts in the game must match section 12 of the requirements doc.
- Project docs (Vietnamese) start at `docs/00-muc-luc.md`: architecture `03`, deployment and day-of checklist `07`, red-team review `08`.
