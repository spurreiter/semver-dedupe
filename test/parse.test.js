const assert = require('assert')
const { parse } = require('../src')
const { mapNameVersion } = require('./support')

describe('parse', function () {
  it('shall parse scoped and normal packages', function () {
    const { modules, name, version } = parse(`${__dirname}/fixtures`)
    // console.log({ modules, name, version })
    assert.strictEqual(name, 'fixtures')
    assert.strictEqual(version, '1.0.0')
    const m = modules.map(({ name, version }) => ({ name, version }))
    assert.deepStrictEqual(mapNameVersion(m), [
      '@scoped/test@1.1.0',
      '@scoped/test1@2.0.0',
      'major@1.0.0',
      'major2@2.0.0',
      'minor@1.0.0',
      'minor2@2.1.0',
      'patch@1.0.0',
      'patch2@2.0.1',
      'pre@1.0.0',
      'test@1.0.3-2'
    ])
  })
})
