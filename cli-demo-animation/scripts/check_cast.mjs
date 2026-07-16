#!/usr/bin/env node
import { readFileSync } from 'node:fs'

function usage(message) {
  if (message) console.error(`error: ${message}`)
  console.error('usage: check_cast.mjs <cast> --command <visible-command> --color-marker <target-text> [--min <seconds>] [--max <seconds>]')
  process.exit(2)
}

const [castPath, ...args] = process.argv.slice(2)
if (!castPath) usage()

const options = new Map()
for (let index = 0; index < args.length; index += 2) {
  const key = args[index]
  const value = args[index + 1]
  if (!key?.startsWith('--') || value === undefined) usage(`invalid option near ${key ?? '<end>'}`)
  options.set(key, value)
}

const command = options.get('--command')
const colorMarker = options.get('--color-marker')
if (!command) usage('--command is required')
if (!colorMarker) usage('--color-marker is required')

const min = Number(options.get('--min') ?? 5)
const max = Number(options.get('--max') ?? 15)
if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) usage('invalid duration bounds')

const lines = readFileSync(castPath, 'utf8').split(/\r?\n/).filter(Boolean)
if (lines.length < 2) throw new Error('cast has no output events')

const header = JSON.parse(lines[0])
if (header.version !== 3) throw new Error(`expected asciicast v3, found ${header.version}`)

const events = lines.slice(1).map((line, index) => {
  const event = JSON.parse(line)
  if (!Array.isArray(event) || event.length !== 3 || event[1] !== 'o' || typeof event[2] !== 'string') {
    throw new Error(`invalid output event at cast line ${index + 2}`)
  }
  return event
})

const output = events.map((event) => event[2]).join('')
if (!output.includes(command)) throw new Error(`visible command not found: ${JSON.stringify(command)}`)

const markerEvents = events.filter((event) => event[2].includes(colorMarker))
if (markerEvents.length === 0) throw new Error(`target colour marker not found: ${JSON.stringify(colorMarker)}`)
if (!markerEvents.some((event) => /\x1b\[[0-9;]*m/.test(event[2]))) {
  throw new Error(`marker ${JSON.stringify(colorMarker)} is present but has no ANSI style in its event`)
}

const duration = events.reduce((sum, event) => sum + Number(event[0]), 0)
if (duration < min || duration > max) throw new Error(`duration ${duration.toFixed(2)}s is outside ${min}-${max}s`)

const hidden = [...output.matchAll(/\x1b\[\?25l/g)].length
const shown = [...output.matchAll(/\x1b\[\?25h/g)].length
if (hidden !== shown) throw new Error(`cursor state is unbalanced: ${hidden} hide and ${shown} show sequences`)

const last = events.at(-1)
if (last[2] !== '' || Number(last[0]) < 1.5) throw new Error('final event must hold an empty payoff frame for at least 1.5 seconds')

console.log(`PASS ${castPath}`)
console.log(`  visible command: ${command}`)
console.log(`  target colour marker: ${colorMarker}`)
console.log(`  duration: ${duration.toFixed(2)}s`)
console.log(`  cursor pairs: ${hidden}`)
