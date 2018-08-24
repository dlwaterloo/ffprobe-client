#!/usr/bin/env bash

ARGS="-show_streams -show_format -print_format json"
URL="https://www.w3schools.com/html/mov_bbb.webm"
FILE="./test/data/input.webm"
OUT="./test/data"

echo "Generating ffprobe output!"

ffprobe $ARGS $FILE > "$OUT/local-file-output.json" 2> /dev/null
ffprobe $ARGS $URL > "$OUT/local-url-output.json" 2> /dev/null
./test/bin/linux/x64/ffprobe $ARGS $FILE > "$OUT/static-file-output.json" 2> /dev/null
./test/bin/linux/x64/ffprobe $ARGS $URL > "$OUT/static-url-output.json" 2> /dev/null

echo "Finished generating ffprobe output!"
