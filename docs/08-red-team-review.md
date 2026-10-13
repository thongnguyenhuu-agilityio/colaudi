# Cờ Lau Đi — Red-Team Review

| Item | Detail |
| --- | --- |
| Date | 13 Oct 2026, three days before the talk |
| Scope | Code (`api/`, `public/`, `scripts/`, tests), deployment plan (`07-deployment.md`), talk plan (`04-ke-hoach.md`), and consistency across `docs/` |
| Method | An independent reviewer with no access to the design conversation. It ran the unit and end-to-end tests, curl probes and Playwright edge cases, and checked Vercel's docs. Claude then fixed and re-verified every finding |
| Result | 2 critical, 5 high, 5 medium, 4 low. All fixed or mitigated before the first commit. Tests: 28 unit/API (was 22) and 5 end-to-end (was 3) |

## Findings and fixes

### Critical

| # | Finding | Failure scenario | Fix | Status |
| --- | --- | --- | --- | --- |
| C1 | Any failed leaderboard poll switched the page to browser-only storage for good. Later submits then "succeeded" locally without reaching the server | A Redis blip during the 5-minute play window: dozens of players see "Đã ghi danh, hạng 3" and are missing from the real board | Mode is decided once at load: `local` only when there is no API at all (404 or non-JSON). In server mode a failed poll shows "Mất kết nối, đang thử lại…" and keeps the last board. A failed submit shows the error and keeps the button enabled for a retry | Fixed; new e2e test simulates a 503 outage and a retry |
| C2 | Docs contradicted each other on deploying production on stage. `04`, `06`, `01` and `03` said `vercel --prod` live; `07` said production stays on `final`. `npm run deploy` and `CLAUDE.md` offered the command | The presenter, or Claude Code told to "deploy", replaces production with the half-built demo branch just as 100+ people open the link | One rule everywhere: production only changes when Thong pushes `main`; nothing is deployed on stage. Removed `npm run deploy`. Added `.claude/settings.json` deny rules for `vercel --prod` and pushes to `main`, which also works as a live example of permissions on slide 6 | Fixed |

### High

| # | Finding | Fix | Status |
| --- | --- | --- | --- |
| H1 | The browser sent its own time, so `curl` with 36 points and 15 s took first place. Many honest players will score 36, so time decides the winner | The server records when each run starts (`action: 'start'`) and measures the time itself; the browser's time is ignored. Submits with no recorded start are refused. Minimum run time `MIN_RUN_SEC` defaults to 45 s; set it from the fastest honest rehearsal run. Points can still be forged, because the answers ship to the browser, so the co-host checks the top 3 before announcing | Fixed and mitigated |
| H2 | No limit on posts; `GET ?r=random` bypassed the CDN and spent Redis quota | GET with any query string is refused. The board is cached 2 s inside each function instance as well as at the CDN. POSTs are capped at 40 per IP per 10 minutes (generous for a shared office NAT). Organisers can close sign-ups instantly with `npm run board -- <url> close` | Fixed |
| H3 | The teardown step (`vercel env rm EVENT_CODE`) would have reopened the board to anyone, and only after a redeploy | Teardown now closes sign-ups with the `close` command (instant, no redeploy), then deletes the project | Fixed in `07` |
| H4 | Planned `cp0` removed `score.js`, which the API imports; the backend would crash at `cp0`. Rebuilding scoring, form, polling and board in 7 minutes was unrealistic | `cp0` = the full game with only the scoring rule stubbed (`pointsFor` returns 0) and its tests removed. The Dev stage builds `score.js` test-first in about 3 minutes | Fixed in `04`, `07` |
| H5 | Vercel Hobby can block Git-triggered deploys of private repos when the commit author is not the account owner, or a commit lists co-authors (community reports, unverified) | First push on Tuesday is the test. If the deployment shows "Blocked", commit with the email of the Vercel/GitHub account owner and without co-author lines, or deploy with `vercel --prod` from Thong's terminal | Check on Tue 13 Oct |

### Medium

| # | Finding | Fix | Status |
| --- | --- | --- | --- |
| M1 | After clicking a header button, Enter toggled sound or went back to the title instead of advancing (risky during the coronation) | Header buttons drop focus after a click | Fixed; e2e test |
| M2 | `ADMIN_KEY` typed into curl commands; no way to remove a name posted several times | `npm run board -- <url> rm "<name>"` removes every entry with that name; the key is read from the environment, never the command line | Fixed |
| M3 | On Vercel without Redis the API silently used memory, so each instance showed a different board | On Vercel without Redis the API returns 503; memory is only used locally | Fixed; unit test |
| M4 | The co-host had no admin key, URL, event code or backup video; the Mac had no Playwright browser | Co-host kit and `npx playwright install chromium` added to the checklist in `07` | Fixed in `07` |
| M5 | Anyone playing production between the morning wipe and the talk stays on the board | Wipe again at 25:00, just before posting the link | Fixed in `04`, `07` |

### Low

| # | Finding | Fix | Status |
| --- | --- | --- | --- |
| L1 | Players saw the presenter shortcuts; `S` in full mode skipped battles and reached sign-up | Full shortcut list only with `?presenter` in the URL; `S` disabled in full mode | Fixed |
| L2 | Plan opened with 2 battles, the game required 3 | Quick mode is now 2 battles | Fixed |
| L3 | Stale docs: key names, README references, Redis read estimate | Updated `01`, `03`, `04`, `06`, `07` | Fixed |
| L4 | Ties at the same second ordered by the stored text | Equal points and seconds: whoever submitted first stays ahead | Fixed; unit test |

## Confirmed working

- Player names are escaped wherever they are shown; right-to-left spoofing characters are stripped.
- POST responses are never cached; the 2-second CDN cache works for the board.
- No horizontal scrolling at phone width on any screen.
- "Chơi lại" starts a new run with a new id.
- `vercel.json`, Node 22 and the named `GET`/`POST`/`DELETE` exports match Vercel's documentation. Final confirmation is the smoke test on production.

## Residual risks accepted

| Risk | Why accepted | Mitigation |
| --- | --- | --- |
| Points can be forged by someone who reads the code | The answers must ship to the browser; a server-side quiz is out of scope for a 3-day demo | Server-side timing, rate limit, co-host checks top 3 |
| One shared Upstash free database | Enough for a 60-minute event | Keys scoped by environment; created two days before rehearsal |
| Company network may block `vercel.app` | Only testable from the office | Tested Thu 15 Oct; Cloudflare fallback |
