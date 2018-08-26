/* global describe, it, beforeEach */

'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expectedData = require('./data')
const ffprobe = require('../')
const nock = require('nock')
const url = require('url')

chai.use(dirtyChai)

const { expect } = chai
const validPathCases = [
  {
    description: 'Behaviour with default ffprobe path',
    config: undefined
  },
  {
    description: 'Behaviour with custom path',
    config: { path: '/usr/bin/ffprobe' }
  }
]

describe('ffprobe-client', () => {
  // Cannot use absolute paths; expected output uses relative paths
  const filePath = './test/data/input.webm'
  const fileUrl = 'https://www.w3schools.com/html/mov_bbb.webm'
  const invalid = 'wewlad hehexd run it down mid'

  beforeEach(() => {
    const parsedUrl = url.parse(fileUrl)

    nock(`${parsedUrl.protocol}//${parsedUrl.host}`)
      .get(parsedUrl.path)
      .replyWithFile(200, filePath, { 'Content-Type': 'video/webm' })
  })

  describe('Invalid binary path', () => {
    it('rejects an ENOENT error', async () => {
      try {
        await ffprobe(filePath, { path: 'cantflimflamthezimzam' })

        expect.fail()
      } catch (err) {
        expect(err.code).to.equal('ENOENT')
      }
    })
  })

  validPathCases.forEach((validPathCase) => {
    describe(validPathCase.description, () => {
      it('resolves to correct JSON when target is a file', async () => {
        try {
          const data = await ffprobe(filePath, validPathCase.config)

          expect(data).to.deep.equal(expectedData.file)
        } catch (err) {
          console.error(err)

          expect.fail()
        }
      })

      it('resolves to correct JSON when target is a url', async () => {
        try {
          const data = await ffprobe(fileUrl, validPathCase.config)

          expect(data).to.deep.equal(expectedData.url)
        } catch (err) {
          console.error(err)

          expect.fail()
        }
      })

      it('rejects when input is malformed', async () => {
        try {
          await ffprobe(invalid, validPathCase.config)
          expect.fail()
        } catch (err) {
          expect(err).to.be.an('error')
        }
      })
    })
  })
})
