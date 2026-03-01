export const textModifiers = {
    reset: { set: '\x1b[0m', unset: '\x1b[0m' },
    bold: { set: '\x1b[1m', unset: '\x1b[22m' },
    dim: { set: '\x1b[2m', unset: '\x1b[22m' },
    italic: { set: '\x1b[3m', unset: '\x1b[23m' },
    underline: { set: '\x1b[4m', unset: '\x1b[24m' },
    strikethrough: { set: '\x1b[9m', unset: '\x1b[29m' },
    // below are ignored in chrome
    blink: { set: '\x1b[5m', unset: '\x1b[25m' },
    hidden: { set: '\x1b[8m', unset: '\x1b[28m' },
    inverse: { set: '\x1b[7m', unset: '\x1b[27m' },
    // below are ignored in mac terminal and chrome
    doubleunderline: { set: '\x1b[21m', unset: '\x1b[24m' },
    framed: { set: '\x1b[51m', unset: '\x1b[54m' },
    // below is supposed to work in chrome and terminal but doesn't
    overlined: { set: '\x1b[53m', unset: '\x1b[55m' },
} as const

export type TextModifier = keyof typeof textModifiers
export type FontStyle = Exclude<TextModifier, 'reset'>

const invertColor =
    'rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b))'
export const cssFontStyle: Record<FontStyle, string> = {
    bold: 'font-weight: bold',
    dim: 'color: rgb(from currentColor r g b / 0.5)',
    italic: 'font-style: italic',
    underline: 'text-decoration: underline',
    strikethrough: 'text-decoration: line-through',
    blink: '', // not supported, do nothing
    hidden: 'color: rgb(from currentColor r g b / 0)',
    inverse: `color: ${invertColor}; background: ${invertColor}`,
    doubleunderline: 'text-decoration: underline double',
    framed: 'padding: 1px; border: 1px solid currentColor',
    overlined: 'text-decoration: overline',
} as const
