import { FlagType, ParsedArgs, parse } from './'
import { Test, describe, given, it } from '@typed/test'

const bool: FlagType = 'boolean'

export const test: Test = describe(`parse`, [
  given(`Flags and Args`, [
    it(`returns ParsedArgs`, ({ equal }) => {
      const flags = { test: bool }

      const args = ['hello', 'world', '--test']

      const expected: ParsedArgs<typeof flags> = {
        _: ['hello', 'world'],
        help: false,
        test: true,
      }

      equal(expected, parse(flags, args))
    }),

    it(`parses all values after '--' into ._`, ({ equal }) => {
      const flags = { test: bool }
      const args = ['--test', '--', '--hello', '--world']

      const expected: ParsedArgs<typeof flags> = {
        _: ['--hello', '--world'],
        help: false,
        test: true,
      }

      equal(expected, parse(flags, args))
    }),
  ]),
])
