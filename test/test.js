'use strict'

const ffprobe = require('../')
const url = 'https://s1.webmshare.com/ZQjzd.webm'

ffprobe(url, { method: 'execFile' })
  .then(console.log)
  .catch(console.error)
