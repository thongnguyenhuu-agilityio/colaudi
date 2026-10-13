# Sound sample provenance

Exactly the files in this folder (7 MP3, 465 KB in total). All three sources are Freesound sounds released under CC0 1.0; each Freesound page links the deed https://creativecommons.org/publicdomain/zero/1.0/ (checked on 2026-10-13 by fetching the page and looking for that link). The audio is the public hq preview MP3 from the Freesound CDN, so quality is capped at that preview.

Edits common to every file: downmix to mono, 44.1 kHz, cut a window out of the source, 3 ms fade-in, a fade-out at the end of the window, peak-normalised with ffmpeg, encoded as MP3 128 kbps. The decoded peaks are about -1.4 dBFS. The three single drum hits share one gain so that the light hit stays lighter than the strong one.

| File | Role | Source (Freesound) | Author | Licence proof | Edits |
| --- | --- | --- | --- | --- | --- |
| `taiko_manh.mp3` | Strong single drum hit | https://freesound.org/s/459561/ "Taiko Drum Sequence for Looping (The Sacrifice)" | Infinita08 | CC0, https://freesound.org/s/459561/ links the CC0 1.0 deed | hit at 29.413 s, 0.41 s long, 50 ms fade-out |
| `taiko_vua.mp3` | Medium single drum hit | same source | Infinita08 | same | hit at 7.593 s, 0.51 s long, 50 ms fade-out |
| `taiko_nhe.mp3` | Light single drum hit | same source | Infinita08 | same | hit at 8.119 s, 0.44 s long, 50 ms fade-out |
| `taiko_don.mp3` | Drum roll / fill segment | same source | Infinita08 | same | 2.63 s from 0.15 s (a roll that ends on a strong hit, then a short fill), 80 ms fade-out |
| `chieng.mp3` | Gong with its natural tail | https://freesound.org/s/486629/ "Gong Brilliant Paiste 32"" | JensZygar | CC0, https://freesound.org/s/486629/ links the CC0 1.0 deed | 15 s from 0.3 s, 2 s fade-out |
| `chieng_nguoc.mp3` | Reversed gong swell | same source as `chieng.mp3` | JensZygar | same | first 3 s with a 2 s fade-out, then reversed (`areverse`) so it swells into the strike, 40 ms fade-out |
| `tu_va.mp3` | Horn (conch shell) | https://freesound.org/s/78974/ "Conch" | RoofDog | CC0, https://freesound.org/s/78974/ links the CC0 1.0 deed | 6.6 s from 0.4 s, 0.3 s fade-out, +18.9 dB gain (the preview is quiet) |

## Notes

- The drum is a taiko recording, the gong a 32 inch Paiste gong and the horn a conch shell. No CC0 recording of a Vietnamese đại cổ, chiêng or tù và turned up, so these are the nearest timbres, not authentic Vietnamese instruments.
- The single hits are cut out of a continuous groove, so each one is truncated at the next hit; the hall reverb in the engine supplies the tail.
- Candidates that were auditioned and not chosen are listed in `prototypes/sound/CANDIDATES.md`.
