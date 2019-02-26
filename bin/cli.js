#!/usr/bin/env node


const pathStart = process.cwd()

dedupe(parse(pathStart), [])
