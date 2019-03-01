# semver-dedupe

This is an improved version building on [npm-semver-dedupe](https://www.npmjs.com/package/npm-semver-dedupe).

Use this if you want to dedupe any versions which may interfere in you app.
This might be the case if you did a fix in a package but still are waiting for
your PR to get merged.

Lets assume you fixed package `bug` in version `1.2.3`.
Your fixed version will become `bug@1.2.4-0` .
Now add `npm i -S bug@1.2.4-0` and `npm i -S semver-dedupe` to your project.
As some dependency may includes `bug@1.2.3`use `semver-dedupe` to get rid of that version. Add a `postinstall` script to perform that task on each install.

```json
{
  "name": "my-app",
  ..,
  "scripts": {
    "postinstall": "semver-dedupe bug@^1"
  }
}
```

Please bear in mind that changing any package dependencies may break your app or
other packages.

## cli

    semver-dedupe [options] [package@range ...]

      --help|-h|-?          this help
      --dry|-d              dry run; don't delete modules
      --quiet|-q            quiet mode; no console.log
      --path|-p <pathname>  use pathname instead of cwd to dedupe
      --major               only dedupe by major version
      --minor               only dedupe by minor version

      package@range         dedupe <package> by <range>; @range is optional

    examples:

      semver-dedupe --dry test
                            dry-run to dedupe `test` in any version
      semver-dedupe test@^2
                            dedupe `test` where version is in range `^2`
      semver-dedupe "test@>=2.0.0"
                            dedupe `test` where version is in greater `2.0.0`
      semver-dedupe test @scoped/test@^1
                            dedupe `test` and `@scoped/test` where version is
                            in range `^1`

## api

Please check the tests and `src/index.js`

## license

MIT Licensed
