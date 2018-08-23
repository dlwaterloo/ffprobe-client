'use strict'

const fileStatic = require('./static-file-output.json')
const fileLocal = require('./local-file-output.json')
const urlStatic = require('./static-url-output.json')
const urlLocal = require('./local-url-output.json')

module.exports = {
  static: {
    file: fileStatic,
    url: urlStatic
  },
  local: {
    file: fileLocal,
    url: urlLocal
  }
}
