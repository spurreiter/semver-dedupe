# semver-dedupe(1) -- dedupe semver-compatible modules

## SYNOPSIS

    semver-dedupe [options] [package@range ...]

## OPTIONS

* `-h`, `--help`:
  Display this help and exit.

* `--version`:
  Output version information and exit.

* `-d`, `--dry`:
  dry run; don't delete modules

* `-q`, `--quiet`:
  quiet mode; no console.log

* `-p`, `--path` `<pathname>`:
  use pathname instead of cwd to dedupe

* `--major`:
  only dedupe by major version

* `--minor`:
  only dedupe by minor version

* `package@range`:
  dedupe <package> by <range>; @range is optional

## EXAMPLE

dry-run to dedupe `test` in any version

    semver-dedupe --dry test

dedupe `test` where version is in range `^2`

    semver-dedupe test@^2

dedupe `test` where version is in greater `2.0.0`

    semver-dedupe "test@>=2.0.0"

dedupe `test` and `@scoped/test` where version is in range `^1`                        

    semver-dedupe test @scoped/test@^1
