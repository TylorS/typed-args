export type Args = ReadonlyArray<string>

export type Flags = { readonly [key: string]: FlagType }

export type FlagType = 'boolean' | 'string'

export type FlagTypeToType = {
  'boolean': boolean
  'string': string
}

export type ParsedArgs<F extends Flags> = {
  readonly _: Args
  readonly help: boolean
} & { readonly [K in keyof F]: FlagTypeToType[F[K]] }
