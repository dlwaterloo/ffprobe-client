#!/usr/bin/env bash

ARGS="-show_streams -show_format -print_format json"
URL="https://www.w3schools.com/html/mov_bbb.webm"
FILE="./test/data/input.webm"
OUT="./test/data"

echo "Generating ffprobe output!"

ffprobe $ARGS $FILE > "$OUT/file-output.json" 2> /dev/null
ffprobe $ARGS $URL > "$OUT/url-output.json" 2> /dev/null

cat "$OUT/file-output.json"
cat "$OUT/url-output.json"

echo "Finished generating ffprobe output!"
