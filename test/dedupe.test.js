const assert = require('assert')
const { parse, dedupe } = require('../src')
const { mapNameVersion } = require('./support')

describe('dedupe', function () {
  let node
  const pathStart = `${__dirname}/fixtures`

  beforeEach(function () {
    node = parse(pathStart)
  })

  it('shall dedupe package `test`', function () {
    const res = dedupe(node, { pathStart, quiet: false, dry: true })
    assert.deepStrictEqual(mapNameVersion(res), [
      'test@1.0.2',
      'test@1.0.0',
      'test@2.0.0',
      'test@1.1.0',
      'test@2.1.0',
      'test@1.0.1',
      'test@2.0.1',
      'test@1.0.2-0'
    ])
  })

  it('shall dedupe major versions of package `test`', function () {
    const res = dedupe(node, { pathStart, major: true, quiet: true, dry: true })
    assert.deepStrictEqual(mapNameVersion(res), [
      'test@1.0.2',
      'test@1.0.0',
      'test@1.1.0',
      'test@1.0.1',
      'test@1.0.2-0'
    ])
  })

  it('shall dedupe minor versions of package `test`', function () {
    const res = dedupe(node, { pathStart, minor: true, quiet: true, dry: true })
    assert.deepStrictEqual(mapNameVersion(res), [
      'test@1.0.2',
      'test@1.0.0',
      'test@1.0.1',
      'test@1.0.2-0'
    ])
  })

  it('shall not dedupe package `test` if not in `names`', function () {
    const names = { '@scoped/test': '^1.0.0' }
    const res = dedupe(node, { pathStart, names, quiet: true, dry: true })
    assert.strictEqual(res.length, 0)
  })

  it('shall dedupe package `test` if in range >= 1.0.1', function () {
    const names = { 'test': '>=1.0.1' }
    const res = dedupe(node, { pathStart, names, quiet: true, dry: true })
    assert.deepStrictEqual(mapNameVersion(res), [
      'test@1.0.2',
      'test@2.0.0',
      'test@1.1.0',
      'test@2.1.0',
      'test@1.0.1',
      'test@2.0.1'
    ])
  })

  it('shall dedupe package `test` if in range ^2', function () {
    const names = { 'test': '^2.0.0' }
    const res = dedupe(node, { pathStart, names, quiet: true, dry: true })
    assert.deepStrictEqual(mapNameVersion(res), [
      'test@2.0.0',
      'test@2.1.0',
      'test@2.0.1'
    ])
  })
})
