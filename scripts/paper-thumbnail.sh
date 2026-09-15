#!/usr/bin/env bash
# Renders the first page of a paper PDF into a full-page PNG,
# for use as the preview image on the Papers page.
#
# Usage: scripts/paper-thumbnail.sh public/papers/some-paper.pdf
# Writes to: public/papers/some-paper.png

set -euo pipefail

pdf="$1"
dir="$(dirname "$pdf")"
name="$(basename "$pdf" .pdf)"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

pdftoppm -png -f 1 -l 1 -r 150 "$pdf" "$tmpdir/page"
convert "$tmpdir/page-1.png" -resize 800x "$dir/$name.png"

echo "$dir/$name.png"
