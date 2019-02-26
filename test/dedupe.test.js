const assert = require('assert')
const { parse, dedupe } = require('../src')

describe('dedupe', function () {
  let node
  const pathStart = `${__dirname}/fixtures`

  before(function () {
    node = parse(pathStart)
  })

  it('shall dedupe package `test`', function () {
    const res = dedupe(node, { pathStart, quiet: true, dry: true })
    assert.strictEqual(res[0].name, 'test')
    assert.strictEqual(res[0].version, '1.0.2')
  })

  it('shall not dedupe package `test` if not in `names`', function () {
    const names = { '@scoped/test': '^1.0.0' }
    const res = dedupe(node, { pathStart, names, quiet: true, dry: true })
    assert.strictEqual(res.length, 0)
  })
})
