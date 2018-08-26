'use strict'

const { execFile } = require('child_process')

function ffprobeExecFile (path, params) {
  return new Promise((resolve, reject) => {
    execFile(path, params, (err, stdout, stderr) => {
      if (err) {
        if (err.code === 'ENOENT') {
          reject(err)
        } else {
          const ffprobeErr = new Error(stderr.split('\n').pop())
          reject(ffprobeErr)
        }
      } else {
        resolve(JSON.parse(stdout))
      }
    })
  })
}

function ffprobe (target, config = {}) {
  const path = config.path || 'ffprobe'
  const params = [
    '-show_streams',
    '-show_format',
    '-print_format',
    'json',
    target
  ]

  return ffprobeExecFile(path, params)
}

module.exports = ffprobe
