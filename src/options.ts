const cssColorTheme = {
    black: {
        chromeLight: '#000000',
        chromeDark: '#000000',
        macOS: '#000000',
        default: '#000000',
    },
    white: {
        chromeLight: '#FFFFFF',
        chromeDark: '#FFFFFF',
        macOS: '#E2E2E2',
        default: '#E2E2E2',
    },
    grey: {
        chromeLight: '#555555',
        chromeDark: '#898989',
        macOS: '#5B5B5B',
        default: '#777777',
    },
    greyBright: {
        chromeLight: '#AAAAAA',
        chromeDark: '#cfd0d0',
        macOS: '#B7B7B7',
        default: '#B7B7B7',
    },
    blue: {
        chromeLight: '#0000AA',
        chromeDark: '#2774f0',
        macOS: '#0006A3',
        default: '#0954F6',
    },
    blueBright: {
        chromeLight: '#5555FF',
        chromeDark: '#669df6',
        macOS: '#0006F6',
        default: '#0088ff',
    },
    cyan: {
        chromeLight: '#00AAAA',
        chromeDark: '#12b5cb',
        macOS: '#1B9BA8',
        default: '#1B9BA8',
    },
    cyanBright: {
        chromeLight: '#55FFFF',
        chromeDark: '#84f0ff',
        macOS: '#28E0E1',
        default: '#28E0E1',
    },
    green: {
        chromeLight: '#00AA00',
        chromeDark: '#01c800',
        macOS: '#1C9B26',
        default: '#1C9B26',
    },
    greenBright: {
        chromeLight: '#55FF55',
        chromeDark: '#01c801',
        macOS: '#26D233',
        default: '#26D233',
    },
    magenta: {
        chromeLight: '#AA00AA',
        chromeDark: '#a142f4',
        macOS: '#A612A4',
        default: '#A612A4',
    },
    magentaBright: {
        chromeLight: '#FF55FF',
        chromeDark: '#d670d6',
        macOS: '#DE19DB',
        default: '#DE19DB',
    },
    red: {
        chromeLight: '#AA0000',
        chromeDark: '#ed4e4c',
        macOS: '#8C0F0D',
        default: '#B83424',
    },
    redBright: {
        chromeLight: '#FF5555',
        chromeDark: '#f28b82',
        macOS: '#DE1715',
        default: '#FB3A26',
    },
    yellow: {
        chromeLight: '#AA5500',
        chromeDark: '#d2c057',
        macOS: '#8E8E25',
        default: '#A5A436',
    },
    yellowBright: {
        chromeLight: '#FFFF55',
        chromeDark: '#ddfb55',
        macOS: '#E2E23B',
        default: '#EAE940',
    },
}
const currentTheme = 'default'
export const colorOption = {
    black: {
        text: {
            set: '\x1b[30m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.black[currentTheme]}`,
        },
        background: {
            set: '\x1b[40m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.black[currentTheme]}`,
        },
    },
    white: {
        text: {
            set: '\x1b[97m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.white[currentTheme]}`,
        },
        background: {
            set: '\x1b[107m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.white[currentTheme]}`,
        },
    },
    grey: {
        text: {
            set: '\x1b[90m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.grey[currentTheme]}`,
        },
        background: {
            set: '\x1b[100m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.grey[currentTheme]}`,
        },
    },
    greyBright: {
        text: {
            set: '\x1b[37m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.greyBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[47m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.greyBright[currentTheme]}`,
        },
    },
    blue: {
        text: {
            set: '\x1b[34m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.blue[currentTheme]}`,
        },
        background: {
            set: '\x1b[44m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.blue[currentTheme]}`,
        },
    },
    blueBright: {
        text: {
            set: '\x1b[94m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.blueBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[104m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.blueBright[currentTheme]}`,
        },
    },
    cyan: {
        text: {
            set: '\x1b[36m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.cyan[currentTheme]}`,
        },
        background: {
            set: '\x1b[46m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.cyan[currentTheme]}`,
        },
    },
    cyanBright: {
        text: {
            set: '\x1b[96m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.cyanBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[106m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.cyanBright[currentTheme]}`,
        },
    },
    green: {
        text: {
            set: '\x1b[32m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.green[currentTheme]}`,
        },
        background: {
            set: '\x1b[42m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.green[currentTheme]}`,
        },
    },
    greenBright: {
        text: {
            set: '\x1b[92m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.greenBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[102m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.greenBright[currentTheme]}`,
        },
    },
    magenta: {
        text: {
            set: '\x1b[35m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.magenta[currentTheme]}`,
        },
        background: {
            set: '\x1b[45m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.magenta[currentTheme]}`,
        },
    },
    magentaBright: {
        text: {
            set: '\x1b[95m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.magentaBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[105m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.magentaBright[currentTheme]}`,
        },
    },
    red: {
        text: {
            set: '\x1b[31m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.red[currentTheme]}`,
        },
        background: {
            set: '\x1b[41m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.red[currentTheme]}`,
        },
    },
    redBright: {
        text: {
            set: '\x1b[91m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.redBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[101m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.redBright[currentTheme]}`,
        },
    },
    yellow: {
        text: {
            set: '\x1b[33m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.yellow[currentTheme]}`,
        },
        background: {
            set: '\x1b[43m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.yellow[currentTheme]}`,
        },
    },
    yellowBright: {
        text: {
            set: '\x1b[93m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.yellowBright[currentTheme]}`,
        },
        background: {
            set: '\x1b[103m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.yellowBright[currentTheme]}`,
        },
    },
} as const

// used to stay in sync with BackgroundColor type with Object.defineProperty
export function capitalize(value: string): string {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
}

export type Color = keyof typeof colorOption
export type BackgroundColor = `bg${Capitalize<Color>}`
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const colors = Object.getOwnPropertyNames(colorOption) as Color[]
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const backgroundColors = colors.map(
    (color) => `bg${capitalize(color)}`,
) as BackgroundColor[]

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

// TODO: support rgb / hex colors
