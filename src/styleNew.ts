import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'

export type LazyStyledText = {
    text: string
    style?: Style
}

export type Style = {
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}

// used to stay in sync with BackgroundColor type with Object.defineProperty
function capitalize(value: string): string {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
}

type BackgroundColor = `bg${Capitalize<Color>}`

type StyleBuilder = {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & (() => Style)

export const style = (function () {
    let textColor: Color | undefined = undefined
    let backgroundColor: Color | undefined = undefined
    let fontStyles: FontStyle[] = []

    function build(): Style {
        const out = {
            textColor,
            backgroundColor,
            fontStyles: fontStyles.length === 0 ? undefined : fontStyles,
        }
        textColor = undefined
        backgroundColor = undefined
        fontStyles = []
        return out
    }

    // Set color options on the builder
    const defineColors = (color: Color) => {
        Object.defineProperty(build, color, {
            get() {
                textColor = color
                return this
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                backgroundColor = color
                return this
            },
            enumerable: true,
        })
    }
    for (const color of Object.getOwnPropertyNames(colors)) {
        defineColors(color as Color)
    }

    // Set font style options on the builder
    const defineFontStyle = (modifier: FontStyle) => {
        Object.defineProperty(build, modifier, {
            get() {
                fontStyles.push(modifier)
                return this
            },
            enumerable: true,
        })
    }
    for (const fontStyle of Object.getOwnPropertyNames(textModifiers)) {
        if (fontStyle === 'reset') {
            continue // reset is a text modifier but not a font style
        }
        defineFontStyle(fontStyle as FontStyle)
    }

    return build as StyleBuilder
})()

class StyledText {
    content: LazyStyledText[]
    currentStyle?: Style

    constructor(...text: LazyStyledText[]) {
        this.content = text
    }

    // text(value: string)
}

function lazy(value: string, style?: Style): LazyStyledText {
    return { text: value, style }
}

const theme = {
    default: style(),
    important: style.bold.italic.red(),
}
const output = new StyledText(
    lazy('hello world'),
    lazy('this line is important', theme.important),
    lazy('this line is not'),
)
console.log(output)
