const rimraf = require('rimraf')

/**
 * strip common pathname
 * @private
 */
const stripPathStart = (pathname, pathStart) => {
  const s = pathname.indexOf(pathStart)
  if (s === 0) {
    return pathname.substring(pathStart.length + 1)
  }
  return pathname
}

/**
 * Deduplicate modules by deleting from node_modules folder hierarchy
 * @param {Module} node
 * @param {Object} args
 * @param {String} args.pathStart
 * @param {Boolean} args.dry - dry run; don't actually delete folder(s)
 * @param {Boolean} args.quiet - no console output
 * @param {Object} args.names - names for consideration
 * @param {String[]} [args.anchestors]
 * @returns {Module[]} deduped modules
 */
function dedupe (node, args) {
  const { ancestors = [], pathStart, dry, quiet, names } = args
  const mods = node.modules
  let deduped = []

  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i]
    for (let j = 0; j < ancestors.length; j++) {
      const doDedupe = ancestors[j].modules.some(x => {
        if (names && !names[mod.name]) return false
        if (x.name !== mod.name) return false
        if (mod.major === 0) {
          // TODO option to compare majors or minors
          return mod.version === x.version
        } else {
          return mod.major === x.major
        }
      })
      if (doDedupe) {
        deduped.push(mod)
        if (!quiet) {
          console.log('deleting "%s@%s"',
            stripPathStart(mod.pathname, pathStart), mod.version
          )
        }
        if (!dry) rimraf.sync(mod.pathname)
        mods.splice(i--, 1)
        break
      }
    }
  }

  mods.forEach(dep => {
    if (!dep.linked) {
      const d = dedupe(dep, {
        ancestors: ancestors.concat(node),
        pathStart,
        dry,
        quiet,
        names
      })
      deduped = deduped.concat(d)
    }
  })

  return deduped
}

module.exports = {
  dedupe
}
