const { parse } = require('./parse')
const { dedupe } = require('./dedupe')

function main (args) {
  const {
    pathStart
  } = args
  const module = parse(pathStart)
  const deduped = dedupe(module, args)
  console.log(deduped)
}

module.exports = {
  main,
  parse,
  dedupe
}
