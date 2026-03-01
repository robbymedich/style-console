export const colorOption = {
    black: {
        text: { set: '\x1b[30m', unset: '\x1b[39m' },
        background: { set: '\x1b[40m', unset: '\x1b[49m' },
    },
    white: {
        text: { set: '\x1b[97m', unset: '\x1b[39m' },
        background: { set: '\x1b[107m', unset: '\x1b[49m' },
    },
    grey: {
        text: { set: '\x1b[90m', unset: '\x1b[39m' },
        background: { set: '\x1b[100m', unset: '\x1b[49m' },
    },
    greyBright: {
        text: { set: '\x1b[37m', unset: '\x1b[39m' },
        background: { set: '\x1b[47m', unset: '\x1b[49m' },
    },
    blue: {
        text: { set: '\x1b[34m', unset: '\x1b[39m' },
        background: { set: '\x1b[44m', unset: '\x1b[49m' },
    },
    blueBright: {
        text: { set: '\x1b[94m', unset: '\x1b[39m' },
        background: { set: '\x1b[104m', unset: '\x1b[49m' },
    },
    cyan: {
        text: { set: '\x1b[36m', unset: '\x1b[39m' },
        background: { set: '\x1b[46m', unset: '\x1b[49m' },
    },
    cyanBright: {
        text: { set: '\x1b[96m', unset: '\x1b[39m' },
        background: { set: '\x1b[106m', unset: '\x1b[49m' },
    },
    green: {
        text: { set: '\x1b[32m', unset: '\x1b[39m' },
        background: { set: '\x1b[42m', unset: '\x1b[49m' },
    },
    greenBright: {
        text: { set: '\x1b[92m', unset: '\x1b[39m' },
        background: { set: '\x1b[102m', unset: '\x1b[49m' },
    },
    magenta: {
        text: { set: '\x1b[35m', unset: '\x1b[39m' },
        background: { set: '\x1b[45m', unset: '\x1b[49m' },
    },
    magentaBright: {
        text: { set: '\x1b[95m', unset: '\x1b[39m' },
        background: { set: '\x1b[105m', unset: '\x1b[49m' },
    },
    red: {
        text: { set: '\x1b[31m', unset: '\x1b[39m' },
        background: { set: '\x1b[41m', unset: '\x1b[49m' },
    },
    redBright: {
        text: { set: '\x1b[91m', unset: '\x1b[39m' },
        background: { set: '\x1b[101m', unset: '\x1b[49m' },
    },
    yellow: {
        text: { set: '\x1b[33m', unset: '\x1b[39m' },
        background: { set: '\x1b[43m', unset: '\x1b[49m' },
    },
    yellowBright: {
        text: { set: '\x1b[93m', unset: '\x1b[39m' },
        background: { set: '\x1b[103m', unset: '\x1b[49m' },
    },
} as const

export type Color = keyof typeof colorOption
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const colors = Object.getOwnPropertyNames(colorOption) as Color[]

const invertColor =
    'rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b))'
export const fontStyleOption = {
    bold: { set: '\x1b[1m', unset: '\x1b[22m', css: 'font-weight: bold' },
    dim: {
        set: '\x1b[2m',
        unset: '\x1b[22m',
        css: 'color: rgb(from currentColor r g b / 0.5)',
    },
    italic: { set: '\x1b[3m', unset: '\x1b[23m', css: 'font-style: italic' },
    underline: {
        set: '\x1b[4m',
        unset: '\x1b[24m',
        css: 'text-decoration: underline',
    },
    strikethrough: {
        set: '\x1b[9m',
        unset: '\x1b[29m',
        css: 'text-decoration: line-through',
    },
    // below are ignored in chrome when using ANSI styling
    blink: { set: '\x1b[5m', unset: '\x1b[25m', css: '' }, // css not supported
    hidden: {
        set: '\x1b[8m',
        unset: '\x1b[28m',
        css: 'color: rgb(from currentColor r g b / 0)',
    },
    inverse: {
        set: '\x1b[7m',
        unset: '\x1b[27m',
        css: `color: ${invertColor}; background: ${invertColor}`,
    },
    // below are ignored in mac terminal and chrome when using ANSI styling
    doubleunderline: {
        set: '\x1b[21m',
        unset: '\x1b[24m',
        css: 'text-decoration: underline double',
    },
    framed: {
        set: '\x1b[51m',
        unset: '\x1b[54m',
        css: 'padding: 1px; border: 1px solid currentColor',
    },
    // below is supposed to work with ANSI styling but doesn't
    overlined: {
        set: '\x1b[53m',
        unset: '\x1b[55m',
        css: 'text-decoration: overline',
    },
} as const

export type FontStyle = keyof typeof fontStyleOption
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const fontStyles = Object.getOwnPropertyNames(
    fontStyleOption,
) as FontStyle[]
