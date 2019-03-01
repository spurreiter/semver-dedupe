const assert = require('assert')
const { cli } = require('..')

describe('cli', function () {
  const tests = [
    [['--help'], { help: true }],
    [['-h'], { help: true }],
    [['-?'], { help: true }],
    [['--dry'], { dry: true }],
    [['-d'], { dry: true }],
    [['--quiet'], { quiet: true }],
    [['-q'], { quiet: true }],
    [['--major'], { major: true }],
    [['--minor'], { major: false, minor: true }],
    [['--minor', '-d', '-q'], { major: false, minor: true, dry: true, quiet: true }],
    [['test', '-q'], { quiet: true, names: { test: '*' } }],
    [['-q', '@scoped/test'], { quiet: true, names: { '@scoped/test': '*' } }],
    [['test@~1.2.0-1', '@scoped/test@^2'], { names: { '@scoped/test': '^2', test: '~1.2.0-1' } }],
    [['--path', '/tmp/path'], { pathStart: '/tmp/path' }]
  ]
  tests.forEach(test => {
    const [argv, exp] = test
    it(argv.join(' '), function () {
      const res = cli(argv)
      assert.deepStrictEqual(res, exp)
    })
  })
})
