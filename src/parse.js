const fs = require('fs')
const path = require('path')
const semver = require('semver')

const isScoped = name => name.indexOf('@') === 0

const flatten = (arr = [], depth = 1) =>
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v)
    ? flatten(v, depth - 1)
    : v
  ), [])

const parseScoped = pathname => fs.readdirSync(pathname)
  .filter(dots)
  .map(name => parse(path.join(pathname, name)))
  .filter(Boolean)

function parse (pathname) {
  const nodeModules = path.join(pathname, 'node_modules')
  const pkg = require(path.join(pathname, 'package.json'))
  const name = pkg.name
  const version = semver.parse(pkg.version)
  let modules = []
  if (fs.existsSync(nodeModules)) {
    modules = fs.readdirSync(nodeModules).filter(dots).map(name => {
      return !isScoped(name)
        ? parse(path.join(nodeModules, name))
        : parseScoped(path.join(nodeModules, name))
    }).filter(Boolean)
    modules = flatten(modules)
  }
  return {
    linked: fs.lstatSync(pathname).isSymbolicLink(),
    pathname: pathname,
    modules: modules,
    name: name,
    version: [version.major, version.minor, version.patch].join('.'),
    major: version.major,
    minor: version.minor,
    patch: version.patch
  }
}

function dots (x) {
  if (x[0] === '.') return false
  return true
}

module.exports = {
  parse
}
