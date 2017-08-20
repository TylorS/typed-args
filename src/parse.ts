import { Args, FlagType, Flags, ParsedArgs } from './types'
import { concat, contains, equals, filter, findIndex, keys, length, range, reduce, set } from '167'

export function parse<F extends Flags>(flags: F, args: Args): ParsedArgs<F> {
  const usedIndices: Array<number> = []
  const extraArgs = parseExtraArgs(args, usedIndices)

  const parsedFlags = parseFlags(Object.assign({}, flags, { help: 'boolean' }), usedIndices, args)

  const additionalArgs = concat(filter((_, i) => !contains(i, usedIndices), args), extraArgs)

  return Object.assign({}, parsedFlags, { _: additionalArgs })
}

function parseExtraArgs(args: Args, usedIndices: Array<number>): Args {
  const index = findIndex(equals('--'), args)

  if (index === -1) return []

  const lastIndex = length(args) - 1

  usedIndices.push(...range(index, lastIndex))

  return args.slice(index + 1)
}

const FLAG_PREFIX = `--`

function parseFlags<F extends Flags>(flags: F, usedIndices: Array<number>, args: Args) {
  return reduce(
    (parsedFlags, key) => {
      const type: FlagType = flags[key]

      if (type === 'boolean') return parseBooleanFlag(key, args, parsedFlags, usedIndices)

      return parseStringFlag(key, args, parsedFlags, usedIndices)
    },
    {} as ParsedArgs<F>,
    keys(flags)
  )
}

function parseBooleanFlag<F extends Flags>(
  key: keyof F,
  args: Args,
  parsedFlags: ParsedArgs<F>,
  usedIndices: Array<number>
): ParsedArgs<F> {
  const index = findIndex(equals(`${FLAG_PREFIX}${key}`), args)

  if (index === -1 || contains(index, usedIndices)) return set(key, false, parsedFlags)

  usedIndices.push(index)

  return set(key, true, parsedFlags)
}

function isFlag(str: string): boolean {
  return str.startsWith('-')
}

function parseStringFlag<F extends Flags>(
  key: keyof F,
  args: Args,
  parsedFlags: ParsedArgs<F>,
  usedIndices: Array<number>
): ParsedArgs<F> {
  const index = findIndex(equals(`${FLAG_PREFIX}${key}`), args)
  const nextIndex = index + 1

  if (index === -1 || contains(index, usedIndices)) return set(key, '', parsedFlags)

  usedIndices.push(index)

  if (isFlag(args[nextIndex])) return set(key, '', parsedFlags)

  usedIndices.push(nextIndex)

  return set(key, args[nextIndex] || '', parsedFlags)
}
