const semver = require('semver')
const rimraf = require('rimraf')

/**
 * strip common pathname
 * @private
 */
const stripPathStart = (pathname, pathStart) => {
  const s = pathname.indexOf(pathStart)
  return (s === 0)
    ? pathname.substring(pathStart.length + 1)
    : pathname
}

/**
 * Deduplicate modules by deleting from node_modules folder hierarchy
 * @param {Module} node
 * @param {Object} args
 * @param {String} args.pathStart
 * @param {Boolean} args.dry - dry run; don't actually delete folder(s)
 * @param {Boolean} args.quiet - no console output
 * @param {Boolean} args.major - only dedupe matching major versions
 * @param {Boolean} args.minor - only dedupe matching minor versions
 * @param {Object} args.names - names for consideration
 * @param {String[]} [args.anchestors]
 * @returns {Module[]} deduped modules
 */
function dedupe (node, args) {
  const { ancestors = [], pathStart, dry, quiet, major, minor, names } = args
  const any = !major && !minor && !names
  const mods = node.modules
  let deduped = []

  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i]
    for (let j = 0; j < ancestors.length; j++) {
      const doDedupe = ancestors[j].modules.some(anc => {
        if (names && !names[mod.name]) return false
        if (anc.name !== mod.name) return false

        if (names) { // dedupe all versions which match range
          const range = names[mod.name] || '*'
          return semver.satisfies(mod.version, range)
        }
        if (any) return true
        if (major && anc.major === mod.major) return true
        if (minor && anc.major === mod.major && anc.minor === mod.minor) return true

        return false
      })
      if (doDedupe) {
        deduped.push(mod)
        if (!quiet) {
          console.log('deleting "%s@%s"',
            stripPathStart(mod.pathname, pathStart), mod.version
          )
        }
        // istanbul ignore next
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
        major,
        minor,
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
