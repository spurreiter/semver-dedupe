const { resolve } = require('path')
const includes = (arr, comp) => comp.some(val => arr.includes(val))

function cli (argv = process.argv.slice(2)) {
  const o = {}

  if (includes(argv, ['--help', '-h', '-?'])) {
    return { help: true }
  }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '--version': {
        o.version = require('../package.json').version
        break
      }
      case '--dry':
      case '-d': {
        o.dry = true
        break
      }
      case '--quiet':
      case '-q': {
        o.quiet = true
        break
      }
      case '--path':
      case '-p': {
        const arg = argv.shift()
        if (!arg || arg[0] === '-') {
          console.error('--path needs pathname')
          process.exit(1)
        }
        o.pathStart = resolve(process.cwd(), arg)
        break
      }
      case '--major': {
        o.major = true
        break
      }
      case '--minor': {
        o.major = false
        o.minor = true
        break
      }
      default: {
        if (!o.names) o.names = {}
        const [x, name, version = '*'] = /^(@?[^@]+)(?:@([^@]+)|)/.exec(arg) // eslint-disable-line no-unused-vars
        o.names[name] = version
        break
      }
    }
  }
  return o
}

module.exports = { cli }
