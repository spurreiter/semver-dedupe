const { parse } = require('./parse')
const { dedupe } = require('./dedupe')
const { cli } = require('./cli')

function main (args) {
  const { pathStart = process.cwd() } = args
  const mod = parse(pathStart)
  const deduped = dedupe(mod, args)
  return deduped
}

module.exports = {
  cli,
  main,
  parse,
  dedupe
}
