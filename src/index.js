const { parse } = require('./parse')
const { dedupe } = require('./dedupe')

function main (args) {
  const { pathStart } = args
  const mod = parse(pathStart)
  const deduped = dedupe(mod, args)
  return deduped
}

module.exports = {
  main,
  parse,
  dedupe
}
