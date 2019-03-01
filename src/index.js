const { parse } = require('./parse')
const { dedupe } = require('./dedupe')
const { cli } = require('./cli')

function main (args) {
  args.pathStart = args.pathStart || process.cwd()
  const mod = parse(args.pathStart)
  const deduped = dedupe(mod, args)
  return deduped
}

module.exports = {
  cli,
  main,
  parse,
  dedupe
}
