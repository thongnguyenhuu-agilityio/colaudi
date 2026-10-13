#!/usr/bin/env bash
# Rebuilds prototypes/sound/candidates/*.mp3 from Freesound (CC0 only).
# For every entry: read the sound page, require the CC0 deed link, download the public hq preview,
# cut a window (start + length in seconds, natural tail kept), mono 44.1 kHz MP3 ~128 kbps, peak -1 dBFS.
# Raw downloads go to a temp dir outside the repo and are treated as data, never executed.
# Usage: prototypes/fetch-candidates.sh   (needs curl and ffmpeg; FFMPEG=/path overrides)
set -euo pipefail

FFMPEG="${FFMPEG:-$(command -v ffmpeg || echo /opt/homebrew/bin/ffmpeg)}"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
OUT="$(cd "$(dirname "$0")" && pwd)/sound/candidates"
RAW="$(mktemp -d "${TMPDIR:-/tmp}/colaudi-raw.XXXXXX")"
mkdir -p "$OUT"
trap 'rm -rf "$RAW"' EXIT

# kind id start_s length_s
LIST='
drum 405127 0.3 10
drum 459561 0.0 12
drum 621296 1.0 8
drum 209546 0.0 11.5
drum 632099 0.0 12
drum 329027 8.0 10
drum 328009 0.2 2.95
drum 502942 0.1 15
drum 428611 0.9 15
drum 373946 0.0 12
drum 522612 0.3 6.65
drum 486140 0.0 1.78
drum 375286 0.3 6.9
gong 486629 0.3 15
gong 316642 0.3 15
gong 209918 0.1 15
gong 240159 0.3 12.8
gong 735855 0.0 15
gong 158189 5.1 15
gong 803159 31.7 12.5
gong 152673 85.95 7.5
gong 397352 0.3 15
horn 78974 0.4 6.6
horn 64830 1.0 7.5
horn 528598 0.2 12
horn 479310 1.6 4.7
horn 223368 5.4 8.1
horn 704440 0.4 12.1
horn 512490 0.0 8.4
horn 501030 0.2 10.6
horn 402753 0.4 7.6
horn 328541 0.0 10.8
'

echo "$LIST" | while read -r kind id start len; do
  [ -z "${kind:-}" ] && continue
  page="$RAW/$id.html"
  curl -fsSL -A "$UA" "https://freesound.org/s/$id/" -o "$page"
  if ! grep -q 'creativecommons.org/publicdomain/zero/1.0/' "$page"; then
    echo "SKIP $id: page does not show the CC0 deed" >&2; continue
  fi
  url="$(grep -o "https://cdn.freesound.org/previews/[0-9]*/${id}_[0-9]*-hq.mp3" "$page" | head -1)"
  [ -n "$url" ] || { echo "SKIP $id: no hq preview url" >&2; continue; }
  curl -fsSL -A "$UA" "$url" -o "$RAW/$id.mp3"
  # pass 1: measure the peak of the window; pass 2: scale it to -1 dBFS
  peak="$("$FFMPEG" -hide_banner -nostats -ss "$start" -t "$len" -i "$RAW/$id.mp3" -ac 1 -af volumedetect -f null - 2>&1 \
          | sed -n 's/.*max_volume: \(-\{0,1\}[0-9.]*\) dB.*/\1/p' | head -1)"
  gain="$(awk -v p="$peak" 'BEGIN { printf "%.2f", -1 - p }')"
  # 3 ms fade-in and a 40 ms fade-out only to avoid clicks at the cut; the natural tail is kept
  fade_at="$(awk -v l="$len" 'BEGIN { printf "%.3f", l - 0.04 }')"
  "$FFMPEG" -hide_banner -loglevel error -y -ss "$start" -t "$len" -i "$RAW/$id.mp3" -ac 1 -ar 44100 \
    -af "afade=t=in:d=0.003,afade=t=out:st=${fade_at}:d=0.04,volume=${gain}dB" \
    -c:a libmp3lame -b:a 128k "$OUT/${kind}_${id}.mp3"
  echo "ok ${kind}_${id}.mp3 (peak ${peak} dB, gain ${gain} dB)"
done
