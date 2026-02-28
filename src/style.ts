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

const NEW = Symbol('new')
type InternalBuilder = {
    readonly [key in Color]: InternalBuilder
} & {
    readonly [key in BackgroundColor]: InternalBuilder
} & {
    readonly [key in FontStyle]: InternalBuilder
} & {
    NEW: (style: Style) => InternalBuilder
} & (() => Stylist) &
    StringToLazyStyledText &
    ArrayToLazyStyledText

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

    if (text.length === 1) {
        if (typeof firstArg !== 'string') {
            if (Array.isArray(firstArg)) {
                throw new Error('ahh')
            }
            if (
                this.textColor !== undefined &&
                firstArg.textColor === undefined
            ) {
                firstArg.textColor = this.textColor
            }
            if (
                this.backgroundColor !== undefined &&
                firstArg.backgroundColor === undefined
            ) {
                firstArg.backgroundColor = this.backgroundColor
            }
            if (
                finalStyles !== undefined &&
                firstArg.fontStyles === undefined
            ) {
                firstArg.fontStyles = finalStyles
            }
            return firstArg
        }
        return {
            text: firstArg,
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            fontStyles: finalStyles,
        }
    }

    const results: LazyStyledText[] = []
    // TODO: refactor to simplify and clean up
    for (const arg of text) {
        if (typeof arg === 'string') {
            results.push({
                text: arg,
                textColor: this.textColor,
                backgroundColor: this.backgroundColor,
                fontStyles: finalStyles,
            })
        } else {
            let priorLazyText
            if (Array.isArray(arg)) {
                priorLazyText = arg
            } else {
                priorLazyText = [arg]
            }
            for (const lazyText of priorLazyText) {
                if (typeof lazyText === 'string') {
                    throw new Error(
                        'invalid type, expected a LazyStyledText argument',
                    )
                }
                if (
                    this.textColor !== undefined &&
                    lazyText.textColor === undefined
                ) {
                    lazyText.textColor = this.textColor
                }
                if (
                    this.backgroundColor !== undefined &&
                    lazyText.backgroundColor === undefined
                ) {
                    lazyText.backgroundColor = this.backgroundColor
                }
                if (
                    finalStyles !== undefined &&
                    lazyText.fontStyles === undefined
                ) {
                    lazyText.fontStyles = finalStyles
                }
                results.push(lazyText)
            }
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
