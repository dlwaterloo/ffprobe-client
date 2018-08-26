#!/usr/bin/env bash

LOCAL="ffprobe"
STATIC=$(./scripts/get-path.js)
ARGS="-show_streams -show_format -print_format json"
URL="https://www.w3schools.com/html/mov_bbb.webm"
FILE="./test/data/input.webm"
OUT="./test/data"

echo "Generating ffprobe output!"

$LOCAL $ARGS $FILE > "$OUT/local-file-output.json" 2> /dev/null
$LOCAL $ARGS $URL > "$OUT/local-url-output.json" 2> /dev/null
$STATIC $ARGS $FILE > "$OUT/static-file-output.json" 2> /dev/null
$STATIC $ARGS $URL > "$OUT/static-url-output.json" 2> /dev/null

cat "$OUT/local-file-output.json"
cat "$OUT/local-url-output.json"
cat "$OUT/static-file-output.json"
cat "$OUT/static-url-output.json"

echo "Finished generating ffprobe output!"
