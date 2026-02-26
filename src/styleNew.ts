import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'

export type LazyStyledText = {
    text: string
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
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

export type Stylist = (() => Style) & ((text: string) => LazyStyledText)

export type StyleBuilder = {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & (() => Stylist) &
    ((text: string) => LazyStyledText)

export type StyleInitializer = {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & {
    default: () => Stylist
} & {
    default: (text: string) => LazyStyledText
}

function createStylist(options?: Style) {
    let textColor: Color | undefined = options?.textColor
    let backgroundColor: Color | undefined = options?.backgroundColor
    let fontStyles: FontStyle[] = options?.fontStyles ?? []

    function stylist(): Style
    function stylist(text: string): LazyStyledText
    function stylist(text?: string): LazyStyledText | Style {
        if (text === undefined) {
            return {
                textColor,
                backgroundColor,
                fontStyles: fontStyles.length === 0 ? undefined : fontStyles,
            }
        }
        return {
            text,
            textColor,
            backgroundColor,
            fontStyles: fontStyles.length === 0 ? undefined : fontStyles,
        }
    }

    function build(optionalText?: string): LazyStyledText | Stylist {
        if (optionalText !== undefined) {
            return stylist(optionalText)
        }
        return stylist
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
}

export const style = (function () {
    const build = {}

    // set default option
    Object.defineProperty(build, 'default', {
        get() {
            return createStylist()
        },
        enumerable: true,
    })

    // Set color options on the builder
    const defineColors = (color: Color) => {
        Object.defineProperty(build, color, {
            get() {
                return createStylist({ textColor: color })
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                return createStylist({ backgroundColor: color })
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
                return createStylist({ fontStyles: [modifier] })
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

    return build as StyleInitializer
})()

class StyledText {
    content: LazyStyledText[]
    currentStyle?: Style

    constructor(...text: LazyStyledText[]) {
        this.content = text
    }

    // text(value: string)
}

const theme = {
    default: style.default(),
    important: style.bold.italic.red(),
}
const output = new StyledText(
    theme.default('hello world'),
    theme.important('this line is important'),
    theme.default('this line is not'),
    style.bgBlue('this has a blue background'),
)
console.log(output)

console.log(
    style.bgBlueBright('hi there' + JSON.stringify(style.red('hello there'))),
)
console.log(style.default('hi'))
console.log(theme.important())
