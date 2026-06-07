const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const projectRoot = path.resolve(__dirname, '..')
const paypalUrl = 'https://www.paypal.com/donate/?hosted_button_id=5B7DW8WU25SS8'

test('popup includes the WHEELY support link', () => {
  const popup = fs.readFileSync(path.join(projectRoot, 'popup.html'), 'utf8')

  assert.match(popup, /Support WHEELY ❤️/)
  assert.ok(popup.includes(`href="${paypalUrl}"`))
  assert.match(popup, /target="_blank"/)
  assert.match(popup, /rel="noopener noreferrer"/)
})

test('README includes support and Chrome Web Store copy', () => {
  const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8')
  const storeCopy = `Enjoying WHEELY? Support its development: ${paypalUrl}`

  assert.match(readme, /## Support/)
  assert.ok(readme.includes(storeCopy))
})

test('manifest version is 2.1', () => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'manifest.json'), 'utf8'),
  )

  assert.equal(manifest.version, '2.1')
})
