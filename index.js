const JSONStream = require('JSONStream')
const bl = require('bl')
const { spawn, execFile } = require('child_process')

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

function ffprobeSpawn (path, params) {
  let stdout
  let stderr
  const ffprobe = spawn(path, params)

  ffprobe.stdout
    .pipe(JSONStream.parse())
    .once('data', (data) => {
      stdout = data
    })

  return new Promise((resolve, reject) => {
    ffprobe.stderr
      .pipe(bl((err, data) => {
        if (err) reject(err)

        stderr = data.toString()
      }))

    ffprobe.once('close', (exitCode) => {
      if (exitCode === 0) {
        resolve(stdout)
      } else {
        // Relevant ffprobe error is last line
        const ffprobeErr = new Error(stderr.split('\n').pop())
        reject(ffprobeErr)
      }
    })
  })
}

function ffprobeExec (target, config = {}) {
  const path = config.path || 'ffprobe'
  const method = config.method || 'execFile'
  const params = [
    '-show_streams',
    '-show_format',
    '-print_format',
    'json',
    target
  ]

  switch (method) {
    case 'execFile':
      return ffprobeExecFile(path, params)
    case 'spawn':
      return ffprobeSpawn(path, params)
    default:
      const err = new Error('Invalid method configuration; please use spawn or execFile')
      return Promise.reject(err)
  }
}

module.exports = ffprobeExec
