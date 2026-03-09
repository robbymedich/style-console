/**
 * ANSI escape sequences for each supported foreground and background color.
 *
 * Each color exposes a `text` variant for foreground styling and a
 * `background` variant for background styling. The `set` sequence enables the
 * color and the `unset` sequence resets only that color channel.
 */
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

/**
 * Capitalizes the first character of a string.
 *
 * This is used to keep runtime-generated background color names in
 * sync with the `BackgroundColor` template-literal type.
 *
 * @param value - String to capitalize.
 * @returns The same string with the first character uppercased.
 */
export function capitalize(value: string): string {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
}

/** Supported foreground color names. */
export type Color = keyof typeof colorOption

/** Supported background color names such as `bgRed` or `bgBlueBright`. */
export type BackgroundColor = `bg${Capitalize<Color>}`

/** List of supported foreground colors. */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const colors = Object.getOwnPropertyNames(colorOption) as Color[]

/** List of supported background color builder properties. */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const backgroundColors = colors.map(
    (color) => `bg${capitalize(color)}`,
) as BackgroundColor[]

/** ANSI escape sequences for each supported font style. */
export const fontStyleOption = {
    bold: { set: '\x1b[1m', unset: '\x1b[22m' }, // TODO: test for bug on dim/bold reset
    dim: { set: '\x1b[2m', unset: '\x1b[22m' },
    italic: { set: '\x1b[3m', unset: '\x1b[23m' },
    underline: { set: '\x1b[4m', unset: '\x1b[24m' },
    strikethrough: { set: '\x1b[9m', unset: '\x1b[29m' },
    // below have limited terminal support
    blink: { set: '\x1b[5m', unset: '\x1b[25m' },
    hidden: { set: '\x1b[8m', unset: '\x1b[28m' },
    inverse: { set: '\x1b[7m', unset: '\x1b[27m' },
    // rare terminal support
    doubleunderline: { set: '\x1b[21m', unset: '\x1b[24m' }, // TODO: test for bug on single/double reset
    framed: { set: '\x1b[51m', unset: '\x1b[54m' },
    overlined: { set: '\x1b[53m', unset: '\x1b[55m' },
} as const

/** Supported font style names. */
export type FontStyle = keyof typeof fontStyleOption

/** List of supported font styles. */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const fontStyles = Object.getOwnPropertyNames(
    fontStyleOption,
) as FontStyle[]

// TODO: support rgb / hex colors
