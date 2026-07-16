#!/bin/sh
set -eu

if [ "$#" -lt 3 ] || [ "$#" -gt 4 ]; then
  echo "usage: record.sh <driver.exp> <output.cast> <title> [COLSxROWS]" >&2
  exit 2
fi

driver=$1
output=$2
title=$3
window_size=${4:-100x28}

exec env \
  -u NO_COLOR \
  -u FORCE_COLOR \
  -u CI \
  TERM=xterm-256color \
  COLORTERM=truecolor \
  NODE_OPTIONS= \
  asciinema rec \
    --headless \
    --idle-time-limit 2 \
    --window-size "$window_size" \
    --title "$title" \
    --overwrite \
    -c "expect $driver" \
    "$output"
