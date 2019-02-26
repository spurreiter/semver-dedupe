const rimraf = require('rimraf')

const stripPathStart = (pathname, pathStart) => {
  const s = pathname.indexOf(pathStart)
  if (s === 0) {
    return pathname.substring(pathStart.length + 1)
  }
  return pathname
}

function dedupe (args) {
  const { node, ancestors, pathStart, dry, names = [] } = args
  const mods = node.modules
  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i]
    for (let j = 0; j < ancestors.length; j++) {
      const doDelete = ancestors[j].modules.some(x => {
        if (names.length && !names.includes(mod.name)) return false
        if (x.name !== mod.name) return false
        if (mod.major === 0) {
          // to do: option to compare majors or minors
          return mod.version === x.version
        } else {
          return mod.major === x.major
        }
      })
      if (doDelete) {
        console.log('deleting "%s@%s"', stripPathStart(mod.pathname, pathStart), mod.version)
        if (!dry) rimraf.sync(mod.pathname)
        mods.splice(i--, 1)
        break
      }
    }
  }

  mods.forEach(dep => {
    if (!dep.linked) {
      dedupe({
        node: dep,
        ancestors: ancestors.concat(node),
        pathStart,
        dry,
        names
      })
    }
  })
}

module.exports = {
  dedupe
}
