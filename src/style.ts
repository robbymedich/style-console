import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'

type Prettify<T> = { [key in keyof T]: T[key] } & {}
type BackgroundColor = `bg${Capitalize<Color>}`

export type Style = {
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}
export type LazyStyledText = Prettify<{ text: string } & Style>

export type StringToLazyStyledText = (text: string | LazyStyledText) => LazyStyledText
export type ArrayToLazyStyledText = (
    ...text: (string | LazyStyledText | LazyStyledText[])[]
) => LazyStyledText[]

export type Stylist = (() => Style) &
    StringToLazyStyledText &
    ArrayToLazyStyledText

export type StyleBuilderChain = {
    readonly [key in Color]: InternalBuilder
} & {
    readonly [key in BackgroundColor]: InternalBuilder
} & {
    readonly [key in FontStyle]: InternalBuilder
} & (() => Stylist) &
    StringToLazyStyledText &
    ArrayToLazyStyledText

const NEW = Symbol('new')
type InternalBuilder = StyleBuilderChain & {
    NEW: (style: Style) => InternalBuilder
}

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
export type StyleBuilder = {
    readonly [key in Color]: InternalBuilder
} & {
    readonly [key in BackgroundColor]: InternalBuilder
} & {
    readonly [key in FontStyle]: InternalBuilder
} & {
    none: (() => Stylist) & StringToLazyStyledText & ArrayToLazyStyledText
}
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */

function stylist(): Style
function stylist(text: string | LazyStyledText): LazyStyledText
function stylist(
    ...text: (string | LazyStyledText | LazyStyledText[])[]
): LazyStyledText[]
// eslint-disable-next-line complexity
function stylist(
    this: Style,
    ...text: (string | LazyStyledText | LazyStyledText[])[]
): Style | LazyStyledText | LazyStyledText[] {
    const finalStyles =
        this.fontStyles === undefined || this.fontStyles.length === 0
            ? undefined
            : this.fontStyles
    const firstArg = text[0]

    if (firstArg === undefined) {
        return {
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            fontStyles: finalStyles,
        }
    }
    if (text.length === 1 && typeof firstArg === 'string') {
        return {
            text: firstArg,
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            fontStyles: finalStyles,
        }
    }

    const clean = (part: string | LazyStyledText): LazyStyledText => {
        if (typeof part === 'string') {
            return {
                text: part,
                textColor: this.textColor,
                backgroundColor: this.backgroundColor,
                fontStyles: finalStyles,
            }
        }
        if (
            this.textColor !== undefined &&
            part.textColor === undefined
        ) {
            part.textColor = this.textColor
        }
        if (
            this.backgroundColor !== undefined &&
            part.backgroundColor === undefined
        ) {
            part.backgroundColor = this.backgroundColor
        }
        if (
            finalStyles !== undefined &&
            part.fontStyles === undefined
        ) {
            part.fontStyles = finalStyles
        }
        return part
    }
    if (text.length === 1 && !Array.isArray(firstArg)) {
        return clean(firstArg)
    }
    const results: LazyStyledText[] = []

    for (const part of text) {
        if (Array.isArray(part)) {
            for (const subPart of part) {
                results.push(clean(subPart))
            }
        } else {
            results.push(clean(part))
        }
    }
    return results
}

// used to stay in sync with BackgroundColor type with Object.defineProperty
function capitalize(value: string): string {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
}

const styleBuilder = (function () {
    const options: Style[] = []
    const getStyle = () => options[options.length - 1]!

    function build(
        ...text: (string | LazyStyledText | LazyStyledText[])[]
    ): LazyStyledText[] | LazyStyledText | Stylist {
        const builtStyle = options.pop()
        if (text.length > 0) {
            return stylist.bind(builtStyle)(...text)
        }
        return stylist.bind(builtStyle)
    }
    build.NEW = (style: Style) => {
        options.push(style)
        return build
    }

    // Set color options on the builder
    const defineColors = (color: Color) => {
        Object.defineProperty(build, color, {
            get() {
                getStyle().textColor = color
                return this
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                getStyle().backgroundColor = color
                return this
            },
            enumerable: true,
        })
    }
    for (const color of Object.getOwnPropertyNames(colors)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        defineColors(color as Color)
    }

    // Set font style options on the builder
    const defineFontStyle = (modifier: FontStyle) => {
        Object.defineProperty(build, modifier, {
            get() {
                const current = getStyle()
                if (current.fontStyles === undefined) {
                    current.fontStyles = []
                }
                if (!current.fontStyles.includes(modifier)) {
                    current.fontStyles.push(modifier)
                }
                return this
            },
            enumerable: true,
        })
    }
    for (const fontStyle of Object.getOwnPropertyNames(textModifiers)) {
        if (fontStyle === 'reset') {
            continue // reset is a text modifier but not a font style
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        defineFontStyle(fontStyle as FontStyle)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as InternalBuilder
})()

export const style = (function () {
    const build = {}

    // set none option
    Object.defineProperty(build, 'none', {
        get() {
            return styleBuilder.NEW({})
        },
        enumerable: true,
    })

    // Set color options on the builder
    const defineColors = (color: Color) => {
        Object.defineProperty(build, color, {
            get() {
                return styleBuilder.NEW({ textColor: color })
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                return styleBuilder.NEW({ backgroundColor: color })
            },
            enumerable: true,
        })
    }
    for (const color of Object.getOwnPropertyNames(colors)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        defineColors(color as Color)
    }

    // Set font style options on the builder
    const defineFontStyle = (modifier: FontStyle) => {
        Object.defineProperty(build, modifier, {
            get() {
                return styleBuilder.NEW({ fontStyles: [modifier] })
            },
            enumerable: true,
        })
    }
    for (const fontStyle of Object.getOwnPropertyNames(textModifiers)) {
        if (fontStyle === 'reset') {
            continue // reset is a text modifier but not a font style
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        defineFontStyle(fontStyle as FontStyle)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StyleBuilder
})()
