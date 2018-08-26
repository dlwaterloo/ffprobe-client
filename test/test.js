/* global describe, it, beforeEach */

'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expectedData = require('./data')
const ffprobeBinary = require('ffprobe-static')
const ffprobe = require('../')
const nock = require('nock')
const url = require('url')

chai.use(dirtyChai)

const { expect } = chai
const validTestCases = [
  {
    type: 'local',
    description: 'Behaviour with local ffprobe installation',
    config: undefined
  },
  {
    type: 'static',
    description: 'Behaviour with ffprobe-static installation',
    config: { path: ffprobeBinary.path }
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

  validTestCases.forEach((validTestCase) => {
    describe(validTestCase.description, () => {
      it('resolves to correct JSON when target is a file', async () => {
        try {
          const data = await ffprobe(filePath, validTestCase.config)

          expect(data).to.deep.equal(expectedData[validTestCase.type].file)
        } catch (err) {
          console.error(err)

          expect.fail()
        }
      })

      it('resolves to correct JSON when target is a url', async () => {
        try {
          const data = await ffprobe(fileUrl, validTestCase.config)

          expect(data).to.deep.equal(expectedData[validTestCase.type].url)
        } catch (err) {
          console.error(err)

          expect.fail()
        }
      })

      it('rejects when input is malformed', async () => {
        try {
          await ffprobe(invalid, validTestCase.config)
          expect.fail()
        } catch (err) {
          expect(err).to.be.an('error')
        }
      })
    })
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
})
