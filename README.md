# ffprobe-client

[![npm version](https://badge.fury.io/js/ffprobe-client.svg)](https://badge.fury.io/js/ffprobe-client)
[![Build Status](https://travis-ci.org/ScottyFillups/ffprobe-client.svg?branch=master)](https://travis-ci.org/ScottyFillups/ffprobe-client)
[![Coverage Status](https://coveralls.io/repos/github/ScottyFillups/ffprobe-client/badge.svg?branch=master)](https://coveralls.io/github/ScottyFillups/ffprobe-client?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=ffprobe-client)](https://packagephobia.now.sh/result?p=ffprobe-client)

A zero-dependency, promise-based Node.js API for `ffprobe`.

Below is a comparison between `ffprobe-client` and other popular `ffprobe` libraries, as of August 23<sup>rd</sup>, 2018:

|                              | ffprobe-client |           ffprobe           | node-ffprobe |
|------------------------------|:--------------:|:---------------------------:|:------------:|
|          promise API         |        ✔       |              ✔              |       ✘      |
|      custom ffprobe path     |        ✔       |              ✔              |       ✘      |
|         -show_format         |        ✔       |              ✘              |       ✔      |
| electron support<sup>1</sup> |        ✔       |              ✘              |       ✘      |
|         dependencies         |      none!     | JSONStream, bl, deferential |     none!    |
|         last publish         |   2018-08-23   |          2016-01-02         |  2013-04-20  |

* <sup>1</sup>https://github.com/eugeneware/ffprobe/pull/1

## Usage

```js
// optional: specify a binary path, see config
process.env.FFPROBE_PATH = '/usr/bin/ffprobe'
const ffprobe = require('ffprobe-client')

const file = './path/to/file'
const url = 'http://www.example.com/foo.webm'

// promise
ffprobe('./myfile.webm')
  .then(data => console.log(data.format.duration))
  .catch(err => console.error(err))

// async/await
async function run () {
  try {
    const data = await ffprobe('http://www.example.com/foo.webm')

    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

run()
```

## API

#### ffprobe(target, [config])

Returns a `Promise` which resolves to a `JSON` outputted by `ffprobe`.

#### target

Type: `String`

The file path or URL of the stream for `ffprobe` to analyze. Older versions of `ffprobe` seem to segfault when passed in a URL; please try to keep your `ffprobe` binary up to date.

#### config

Type: `Object`

A configuration object, see details below.

#### config.path

Type: `String`

The path of the `ffprobe` binary. If omitted, the path will be set to the `FFPROBE_PATH` environment variable. If the environment variable is not set, `ffprobe` will be invoked directly (ie. `ffprobe [...]`).

## Payload

Below is an example payload. Note that keys will be omitted if `ffprobe` fails to generate the data.

```json
{
  "streams": [
    {
      "index": 0,
      "codec_name": "vp8",
      "codec_long_name": "On2 VP8",
      "profile": "0",
      "codec_type": "video",
      "codec_time_base": "1/25",
      "codec_tag_string": "[0][0][0][0]",
      "codec_tag": "0x0000",
      "width": 320,
      "height": 176,
      "coded_width": 320,
      "coded_height": 176,
      "has_b_frames": 0,
      "sample_aspect_ratio": "1:1",
      "display_aspect_ratio": "20:11",
      "pix_fmt": "yuv420p",
      "level": -99,
      "field_order": "progressive",
      "refs": 1,
      "r_frame_rate": "25/1",
      "avg_frame_rate": "25/1",
      "time_base": "1/1000",
      "start_pts": 0,
      "start_time": "0.000000",
      "disposition": {
        "default": 1,
        "dub": 0,
        "original": 0,
        "comment": 0,
        "lyrics": 0,
        "karaoke": 0,
        "forced": 0,
        "hearing_impaired": 0,
        "visual_impaired": 0,
        "clean_effects": 0,
        "attached_pic": 0,
        "timed_thumbnails": 0
      }
    },
    {
      "index": 1,
      "codec_name": "vorbis",
      "codec_long_name": "Vorbis",
      "codec_type": "audio",
      "codec_time_base": "1/48000",
      "codec_tag_string": "[0][0][0][0]",
      "codec_tag": "0x0000",
      "sample_fmt": "fltp",
      "sample_rate": "48000",
      "channels": 2,
      "channel_layout": "stereo",
      "bits_per_sample": 0,
      "r_frame_rate": "0/0",
      "avg_frame_rate": "0/0",
      "time_base": "1/1000",
      "start_pts": 0,
      "start_time": "0.000000",
      "disposition": {
        "default": 1,
        "dub": 0,
        "original": 0,
        "comment": 0,
        "lyrics": 0,
        "karaoke": 0,
        "forced": 0,
        "hearing_impaired": 0,
        "visual_impaired": 0,
        "clean_effects": 0,
        "attached_pic": 0,
        "timed_thumbnails": 0
      }
    }
  ],
  "format": {
    "filename": "./test/data/input.webm",
    "nb_streams": 2,
    "nb_programs": 0,
    "format_name": "matroska,webm",
    "format_long_name": "Matroska / WebM",
    "start_time": "0.000000",
    "duration": "10.027000",
    "size": "482282",
    "bit_rate": "384786",
    "probe_score": 100,
    "tags": {
      "encoder": "Lavf52.68.0"
    }
  }
}
```

## Testing Locally

Run `./scripts/gen-output.sh` before running the tests; this command will generate the expected JSON snapshot.
