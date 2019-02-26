const rimraf = require('rimraf')

const stripPathStart = (pathname, pathStart) => {
  const s = pathname.indexOf(pathStart)
  if (s === 0) {
    return pathname.substring(pathStart.length + 1)
  }
  return pathname
}

function dedupe (node, args) {
  const { ancestors = [], pathStart, dry, quiet, names } = args
  const mods = node.modules
  let deleted = []

  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i]
    for (let j = 0; j < ancestors.length; j++) {
      const doDelete = ancestors[j].modules.some(x => {
        if (names && !names[mod.name]) return false
        if (x.name !== mod.name) return false
        if (mod.major === 0) {
          // TODO option to compare majors or minors
          return mod.version === x.version
        } else {
          return mod.major === x.major
        }
      })
      if (doDelete) {
        deleted.push(mod)
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
      deleted = deleted.concat(d)
    }
  })

  return deleted
}

module.exports = {
  dedupe
}
