# Cờ Lau Đi — Sound Plan

| Item | Detail |
| --- | --- |
| Updated | 13 Oct 2026, after a red-team review of the first draft |
| Status | Phase 1 implemented on `feat/war-drums-game`, awaiting owner listen + dry run 2 |
| Requirement | FR-18 "Có âm thanh trống và chiêng, bật tắt được" (Nên có), [01](01-yeu-cau.md) |
| Related | [05 Google Meet](05-to-chuc-google-meet.md) · [07 Deployment](07-deployment.md) · [08 Red-team review](08-red-team-review.md) |

## 1. Goal

Make the drums feel like going to war, in the style of the battle drums in *Tân Tam Quốc*. Make the coronation sound grand, and give the "a thousand years later" finale its own sound. Do this without putting the talk on Fri 16 Oct at risk.

## 2. Constraints that shaped this plan

| # | Constraint | Source | Consequence |
| --- | --- | --- | --- |
| C1 | The talk is **Fri 16 Oct**. The `final` tag is not cut yet. `cp0`–`cp3` are built Wed. Dry run 2 is Thu | [07](07-deployment.md) | Sound freezes before `cp0` is cut. There is no room for a multi-phase build |
| C2 | FR-18 is **Nên có** | [01](01-yeu-cau.md) | Sound must never threaten the game or the live QA demo (`npm run test:e2e` on stage) |
| C3 | The talk is **fully online**: main room A plus relay room B, both Google Meet. There is no physical room with speakers | [05](05-to-chuc-google-meet.md) | Audio reaches the audience only through Meet's **"share tab audio"**. Room B hears it re-encoded a second time and several seconds late |
| C4 | The presenter switches between the game, slides, the Claude app and the terminal | [07](07-deployment.md) §6 | Tab audio only works while the game tab is the presented tab. Expect sound **only in game segments** |
| C5 | Over 100 people play on their own laptops, many in open offices, while also listening to the presenter | [05](05-to-chuc-google-meet.md) | Players must not get music beds that clash with the delayed relayed audio |
| C6 | No runtime dependencies. No build step | CLAUDE.md | Static audio files are allowed. Code stays plain Web Audio |
| C7 | Never silently downgrade | global rules | If samples fail to load, fall back to the synth **and say so** on the sound button |

## 3. Decision

**Use recorded one-shot samples, played as short scripted phrases behind the existing `sfx` API. No sequencer and no music beds for the talk.**

- **Samples:** about 8–10 CC0 one-shots. Total ≤ 1 MB, **MP3 only**, stored in `public/sound/`:
  - đại cổ (big drum) hit and roll
  - trống chiến (war drum) hit
  - rim/stick
  - chiêng (gong) strike
  - tù và (horn)
  - seal stamp / impact
  - reversed gong swell
  - Why MP3: Safari's Ogg/Opus support is uneven, and Playwright's Chromium cannot decode AAC.
- **Phrases:** a phrase is a short list of `[time, sample, gain, rate]` events (≤ 3 s), scheduled when a cue fires. Examples: the accelerating war roll, three overlapping gongs, the seal-stamp tutti.
  - Repeated hits vary in pitch and level, so the drums sound like an ensemble rather than a loop.
  - A phrase is not a beat grid. Crown and finale steps run on `setTimeout` and Enter can skip them, so each step plays its own self-contained phrase.
- **The current synth** (uncommitted improvement in `public/game.js`) is kept for two jobs:
  - It is the **fallback** when samples are missing.
  - It adds a mid-range body under the samples for small speakers.
- **Rejected:**
  - A pre-composed or licensed soundtrack: licensing, file size, and it cannot follow the presenter's Enter presses.
  - A Web Audio sequencer with adaptive music beds (camp groove that grows with wins, battle ostinato, title ambience, bamboo flute): too big for C1/C2, and it fights C3–C5.
  - A shouted "Cờ Lau… đi!" sample: no CC0 recording of a Vietnamese phrase exists, and TTS output carries licence terms. Optional only if colleagues record it with consent (§8).

## 4. Cue sheet

Every cue is a one-shot phrase, with nothing looping. Everything a sound signals is also shown on screen (correct, wrong, time up, surrender), so no information exists only in the sound.

The **Who** column says who hears the cue:
- **P** = presenter page (`?presenter`), which the Meet audience hears through tab share.
- **All** = presenter and every player.

| Scene / moment | Phrase | Who |
| --- | --- | --- |
| Title: "Đánh đủ 12 trận" / "Tập trận nhanh" | Horn call, then 3 big-drum strikes | All |
| Map → battle (`fight`) | Short horn, then a war-drum fill (about 1 s) | All |
| Vote: last 5 s of the 20 s timer | Stick hits speeding up (5 hits, getting louder) | P |
| Vote: "Hết giờ bỏ phiếu" | One gong stab, **then silence** until the pick. The presenter waits 5–10 s for room B, so nothing loops | P |
| Correct answer | Ensemble hit, then the accelerating war roll ending on a big stroke (about 1.3 s, under the "Cờ Lau đi!" overlay) | All |
| Wrong answer | Muffled low drum and a short dissonant gong | All |
| Surrender cascade | Each falling tile is one drum hit, rising in pitch and level; big gong at the end | All |
| Tally / board: name submitted | Gong and a short roll | All |
| **Crown** (8 steps, 2.6 s apart) | Step 0: three slow ceremonial big-drum strikes. This replaces the current `sfx.roll()` on render.<br>Step 2 ("Đại Thắng Minh Hoàng Đế"): tutti hit, horn, gong.<br>Step 3 ("Xưng Hoàng Đế"): three gongs, staggered.<br>Step 6 (the historian's verse): no new sound, the tail rings on.<br>Step 7: one closing stroke | All |
| **Finale** (7 steps, 2.4 s apart) | Step 0 ("Trải hơn một nghìn năm"): reversed gong swell, the sound of time rewinding.<br>Steps 1–2 (the word morph): two drum strikes, the second one pitched down, with a synth sub and a filtered pulse, so ancient turns modern.<br>Step 3 ("Claude"): hybrid impact (big drum, synth sub, gong).<br>Step 5 ("Hỡi tướng sỹ!"): war-drum call to arms.<br>Step 6 (seal): stamp, tutti, gong decaying | All |

**Mix targets:**
- Keep the energy in the mid band, above 150 Hz. Meet and laptop speakers drop the lows.
- Gong and drum tails: the owner chose long rings (updated 2026-10-13, after he rejected the 4 s tails), so gong tails may exceed 4 s (candidates keep their natural 8 to 15 s) and the hall reverb is no longer "light". Risk that stays: two Opus encodes through the relay smear long tails, so ringing cues can blur the next cue on the presenter's stream. The room-B listener in dry run 2 checks this; if the relay mush is bad, shorten tails then, not before.
- **Players** get the cues at 70 % of the presenter level, and nothing from the vote timer.

## 5. Engineering

- **Where the code goes:** stays in the `sound` block of `public/game.js`, behind the existing `sfx` API, extended with `sfx.cue(name)`. A separate file is not justified at this size.
- **Loading:**
  - At page load, `fetch` + `decodeAudioData` all samples into a suspended context, so the first cue has no decode delay.
  - The first key or click resumes the context. Enter already counts as a user gesture because it calls `.click()` inside `keydown`.
  - The title screen makes no sound before the first gesture. Design for that.
- **Scene changes and stale sound:**
  - Each scene gets its own gain node. On `go()`, fade it out over 150 ms and stop its source nodes.
  - Enter-skipping crown/finale steps stops the previous step's drums. Only gong tails may carry over.
  - **Allow one gong voice at a time**: a new gong fades out the old one, so the soft clipper never saturates.
- **Mute:**
  - M / the sound button ramps the master gain to 0, which cuts tails. This is already implemented.
  - Remember the setting in `localStorage` (inside try/catch), so a reload keeps a player's choice.
- **Tab hidden:** fade out and `suspend()` the context on `visibilitychange`, and resume when the tab is visible. Do not rely on `setTimeout` in background tabs.
- **Failure handling:**
  - Sound code never throws.
  - Any load error switches to the synth and labels the button **"Âm thanh: bản tổng hợp (mẫu lỗi) · bấm để tải lại"**. The fallback is visible, never silent (C7).
- **Assets:**
  - Add `.mp3: audio/mpeg` to `scripts/dev.mjs` types.
  - Vercel serves `public/sound/` statically.
  - Players load the samples after the first leaderboard poll, so the download does not compete with it.
- **Provenance:** `public/sound/LICENSES.md` lists, for each file, the source URL, the author, the CC0 proof (a link or screenshot) and any edits (trim, normalise). Freesound CC0 chiêng and tù và recordings are rare. If none is usable, use the closest CC0 gong/horn and say so in the file.

## 6. Verification

| What | How |
| --- | --- |
| Level and clipping | The offline-render harness from the synth work (`OfflineAudioContext`, peak, and RMS above 150 Hz) for every cue and for worst-case stacks (finale step 6, rapid Enter through the crown) |
| No stale sound | e2e with a fake `AudioContext` that counts live sources: after `go()` and after M, live drum sources = 0 |
| No new failures | e2e loads the game with sound on and off and expects **no console errors**. The live QA demo must stay green. Run under Node 22 |
| Mute persists | e2e: press M, reload, sound button still shows "tắt" |
| Fallback is visible | e2e: block `/sound/*`, expect the fallback label on the button |
| What the audience hears | Dry run 2: presenter shares the **tab with audio**. A listener **in room B** judges level and clarity, and goes through the source switches of [07](07-deployment.md) §6 |

`npm test` and the e2e suite must be green before commit.

### Phase 1 as built (13 Oct)

Owner's picks: taiko "Taiko Drum Sequence" (Freesound 459561), gong "Gong Brilliant Paiste 32"" (486629), conch (78974), all CC0; files, edits and proof links are in `public/sound/LICENSES.md` (7 files, 465 KB).

- **Cues:** `start`, `fight`, `tick` and `timeup` (the last two presenter only), `correct`, `wrong`, `tile` (surrender cascade) with `end`, `submitted`, and `crown`/`finale` by step number. A cue fired by a click is issued after `go()`, so the scene change does not fade it.
- **Differences from the plan:** (1) while the samples are still loading (a second or two) cues use the synth, then switch to samples; a failed load keeps the synth and labels the button. (2) In the fallback state a click on the sound button retries the load and `M` still toggles mute. (3) Gong ring is capped at 10.5 s plus the reverb tail, so rings end 10.7 to 12.2 s after the strike. (4) Vote cues follow the visible bar: the timers are rescheduled on every battle render, because a wrong answer re-renders the card and restarts the bar. (5) The recorded drums are 90 % below 300 Hz, so big strokes also get a quiet synth skin layer. (6) 7 files instead of 8 to 10: there is no stick or seal-stamp sample, so the vote ticks are synth and the stamp is the strong ensemble hit plus a synth sub. (7) A wrong pick after "Hết giờ" re-renders the card and restarts the bar, so the `timeup` gong can sound again in the same battle. (8) `sfx.drum/roll/gong/bad` are gone; the public API is `cue`, `scene`, `silence`. (9) `window.__sound` (offline render hook) exists only with `?soundtest`. (10) `prototypes/sound-ab.html` still points at the removed Phase 0 files and no longer works.
- **Measurement** (headless Chromium, `OfflineAudioContext`, 44.1 kHz, samples decoded at the headless 24 kHz context rate; reproduce with `?presenter&soundtest` and `window.__sound.render`): every cue and stack peaks at or below about 0.90 after the clipper and 0.93 before it (worst: finale steps 0 to 6, 0.891 and 0.926); the energy above 150 Hz is 0.1 to 10.4 dB below the full band (drum-only cues are the lowest, about 8 to 10 dB). Run-to-run variation of the synth noise is about 0.04 in peak.
- **Not yet checked:** how it sounds, level through Meet's tab audio, and the room-B relay (dry run 2).

## 7. Timeline and gates

| When | Step | Gate |
| --- | --- | --- |
| **Tue 13 Oct, evening** | **Phase 0:** find CC0 samples and build an A/B listening page (current synth vs samples) for three moments: entering a battle, a correct answer, crown step 2 | Thong listens |
| **Wed 14 Oct, morning** | **Go / no-go** | Go → Phase 1. No-go or no answer → commit the improved synth only, and drop the rest |
| Wed 14 Oct, before `cp0` | **Phase 1:** samples, cue sheet (§4), scene cleanup, mute persistence, fallback label, tests (§6), and docs: FR-18 row and matrix in [01](01-yeu-cau.md), [03](03-kien-truc.md) architecture note, Meet lines in [05](05-to-chuc-google-meet.md) §8 and [07](07-deployment.md) §6 | All tests green. **Sound frozen before `cp0` is cut** |
| Thu 15 Oct | Dry run 2: room-B listening test (§6) | If room B hears mush, lower the gain or turn sound off for the talk (`M`) |
| After the talk | Optional: adaptive music beds, title ambience, bamboo flute, a recorded shout | Not for this event |

## 8. Day-of checklist additions

These go into [05](05-to-chuc-google-meet.md) §8 and [07](07-deployment.md) §6:

- [ ] Present the **Chrome tab** of the game, not the whole screen, with **"Also share tab audio"** ticked. Re-check this after every switch back from slides, the Claude app or the terminal.
- [ ] Morning: open `?presenter`, then press `M` twice to unlock and check the audio.
- [ ] Room A co-host and room B operator keep their mics muted while game audio plays (echo cancellation fights music).
- [ ] Fallback if room B reports bad audio: press `M` and run the game silent. The game needs no sound.

## 9. Red-team findings and how this plan answers them

| Finding | Response |
| --- | --- |
| Schedule leaves no room (High) | One build phase, a hard go/no-go Wed morning, frozen before `cp0` (§7) |
| Scope far beyond a "Nên có" requirement (High) | Sequencer, beds and `rhythms.js` dropped. Short phrases behind `sfx` only (§3) |
| "Cable to room A speakers" fallback impossible, the talk is fully online (High) | Fallback is now tab audio or a silent game (§8) |
| Tab audio vs the run of show's source switches (High) | Sound accepted in game segments only. Re-share checklist and dry-run test (C4, §8) |
| Relay double-encoding (High) | Short, mid-heavy cues, no beds, short tails. Room-B judges in the dry run (§4, §6) |
| Players in open offices, mute not persisted (High) | No beds for players, cues at 70 %, mute remembered (§4, §5) |
| Stale audio on Enter skip / scene change, stacked gongs (Med) | Per-scene gain with fade-out, stop live sources, one gong voice (§5) |
| S key misread (Med) | Cues follow the real S path (title/map/battle → surrender → crown). The finale is reached only from the crown's "Ngàn năm sau…" button |
| Vote timing vs room-B delay (Med) | Gong at "Hết giờ", then silence (§4) |
| Audio unlock and decode latency (Med) | Decode at load, resume on first gesture, morning `M M` check (§5, §8) |
| Formats (Med) | MP3 only (§3) |
| Risk to the on-stage e2e demo (Med) | Sound never throws. e2e expects no console errors (§5, §6) |
| Never silently downgrade (Med) | Synth fallback labelled on the button (§5) |
| CC0 shout does not exist (Med) | Dropped. Provenance file required (§3, §5) |
| Dev server MIME (Low) | `.mp3` type added (§5) |
| Weak testability claim (Low) | Live-source and mute e2e instead of pattern unit tests (§6) |
| Docs drift (Low) | FR-18 matrix row, `game.js` comment and [03](03-kien-truc.md) updated in the same change (§7) |
