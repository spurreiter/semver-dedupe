#!/usr/bin/env node

const { cli, main } = require('..')

const prg = 'semver-dedupe'

const cmd = cli()
if (cmd.version) {
  console.log(cmd.version)
} else if (cmd.help) {
  help()
} else {
  main(cmd)
}

function help () {
  console.log(`
    ${prg} [options] [package@range ...]

      --help|-h|-?          this help
      --version             show version
      --dry|-d              dry run; don't delete modules
      --quiet|-q            quiet mode; no console.log
      --path|-p <pathname>  use pathname instead of cwd to dedupe
      --major               only dedupe by major version
      --minor               only dedupe by minor version

      package@range         dedupe <package> by <range>; @range is optional

    examples:

      ${prg} --dry test
                            dry-run to dedupe \`test\` in any version
      ${prg} test@^2
                            dedupe \`test\` where version is in range \`^2\`
      ${prg} "test@>=2.0.0"
                            dedupe \`test\` where version is in greater \`2.0.0\`
      ${prg} test @scoped/test@^1
                            dedupe \`test\` and \`@scoped/test\` where version is
                            in range \`^1\`
  `)
}
