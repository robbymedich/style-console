export const colors = {
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

export type Color = keyof typeof colors
