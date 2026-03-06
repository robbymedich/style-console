const cssColorTheme = {
    black: '#000000',
    white: '#E5E5E5',
    grey: '#777777',
    greyBright: '#B7B7B7',
    blue: '#0A3CD2',
    blueBright: '#0A78FF',
    cyan: '#1E9BA5',
    cyanBright: '#1EC8D2',
    green: '#239B32',
    greenBright: '#23D232',
    magenta: '#9B46A5',
    magentaBright: '#C846D2',
    red: '#9B2319',
    redBright: '#D22319',
    yellow: '#9B9100',
    yellowBright: '#D2C800',
}
export const colorOption = {
    black: {
        text: {
            set: '\x1b[30m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.black}`,
        },
        background: {
            set: '\x1b[40m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.black}`,
        },
    },
    white: {
        text: {
            set: '\x1b[97m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.white}`,
        },
        background: {
            set: '\x1b[107m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.white}`,
        },
    },
    grey: {
        text: {
            set: '\x1b[90m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.grey}`,
        },
        background: {
            set: '\x1b[100m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.grey}`,
        },
    },
    greyBright: {
        text: {
            set: '\x1b[37m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.greyBright}`,
        },
        background: {
            set: '\x1b[47m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.greyBright}`,
        },
    },
    blue: {
        text: {
            set: '\x1b[34m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.blue}`,
        },
        background: {
            set: '\x1b[44m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.blue}`,
        },
    },
    blueBright: {
        text: {
            set: '\x1b[94m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.blueBright}`,
        },
        background: {
            set: '\x1b[104m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.blueBright}`,
        },
    },
    cyan: {
        text: {
            set: '\x1b[36m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.cyan}`,
        },
        background: {
            set: '\x1b[46m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.cyan}`,
        },
    },
    cyanBright: {
        text: {
            set: '\x1b[96m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.cyanBright}`,
        },
        background: {
            set: '\x1b[106m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.cyanBright}`,
        },
    },
    green: {
        text: {
            set: '\x1b[32m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.green}`,
        },
        background: {
            set: '\x1b[42m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.green}`,
        },
    },
    greenBright: {
        text: {
            set: '\x1b[92m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.greenBright}`,
        },
        background: {
            set: '\x1b[102m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.greenBright}`,
        },
    },
    magenta: {
        text: {
            set: '\x1b[35m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.magenta}`,
        },
        background: {
            set: '\x1b[45m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.magenta}`,
        },
    },
    magentaBright: {
        text: {
            set: '\x1b[95m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.magentaBright}`,
        },
        background: {
            set: '\x1b[105m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.magentaBright}`,
        },
    },
    red: {
        text: {
            set: '\x1b[31m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.red}`,
        },
        background: {
            set: '\x1b[41m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.red}`,
        },
    },
    redBright: {
        text: {
            set: '\x1b[91m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.redBright}`,
        },
        background: {
            set: '\x1b[101m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.redBright}`,
        },
    },
    yellow: {
        text: {
            set: '\x1b[33m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.yellow}`,
        },
        background: {
            set: '\x1b[43m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.yellow}`,
        },
    },
    yellowBright: {
        text: {
            set: '\x1b[93m',
            unset: '\x1b[39m',
            css: `color: ${cssColorTheme.yellowBright}`,
        },
        background: {
            set: '\x1b[103m',
            unset: '\x1b[49m',
            css: `background: ${cssColorTheme.yellowBright}`,
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
        css: 'underline', // text-decoration: ...
    },
    strikethrough: {
        set: '\x1b[9m',
        unset: '\x1b[29m',
        css: 'line-through', // text-decoration: ...
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
        css: 'underline double', // text-decoration: ...
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
        css: 'overline', // text-decoration: ...
    },
} as const

export type FontStyle = keyof typeof fontStyleOption
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const fontStyles = Object.getOwnPropertyNames(
    fontStyleOption,
) as FontStyle[]

// TODO: support rgb / hex colors
