const nameVersion = ({ name, version }) => `${name}@${version}`
const mapNameVersion = m => m.map(nameVersion)

module.exports = {
  mapNameVersion
}
