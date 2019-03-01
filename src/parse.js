const fs = require('fs')
const path = require('path')
const semver = require('semver')
const { flatten } = require('./flatten')

const isScoped = name => name.indexOf('@') === 0

/**
 * @typedef {Object} Module
 * @property {Boolean} linked
 * @property {String} pathname
 * @property {Module[]} modules
 * @property {String} name
 * @property {String} version
 * @property {Number} major
 * @property {Number} minor
 * @property {Number} patch
 */

/**
 * parse all scoped directories with package.json files
 * @private
 * @param {String} pathname
 * @returns {Module[]} modules
 */
function parseScoped (pathname) {
  return fs.readdirSync(pathname)
    .filter(dots)
    .map(name => parse(path.join(pathname, name)))
    .filter(Boolean)
}

/**
 * parse all package.json files
 * @param {String} pathname
 * @returns {Module} modules
 */
function parse (pathname) {
  const nodeModules = path.join(pathname, 'node_modules')
  const pkg = require(path.join(pathname, 'package.json'))
  const { name, version } = pkg
  const { major, minor, patch } = semver(version)
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
    name,
    version,
    major,
    minor,
    patch,
    pathname,
    modules
  }
}

/**
 * @private
 */
function dots (x) {
  if (x[0] === '.') return false
  return true
}

module.exports = {
  parse
}
