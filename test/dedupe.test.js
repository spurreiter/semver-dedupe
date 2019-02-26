const assert = require('assert')
const { parse } = require('../src')

describe('parse', function () {
  it('shall parse scoped and normal packages', function () {
    const { modules, name, version } = parse(`${__dirname}/fixtures`)
    // console.log({ modules, name, version })
    assert.strictEqual(name, 'fixtures')
    assert.strictEqual(version, '1.0.0')
    assert.strictEqual(modules.length, 3)
    assert.strictEqual(modules[0].name, '@scoped/test')
    assert.strictEqual(modules[0].version, '1.1.0')
    assert.strictEqual(modules[1].name, '@scoped/test1')
    assert.strictEqual(modules[1].version, '2.0.0')
    assert.strictEqual(modules[2].name, 'test')
    assert.strictEqual(modules[2].version, '1.0.1')
  })
})
