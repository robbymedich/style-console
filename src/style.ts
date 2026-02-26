import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'

type Prettify<T> = {[key in keyof T]: T[key]} & {}
type BackgroundColor = `bg${Capitalize<Color>}`

export type Style = {
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}
export type LazyStyledText = Prettify<{ text: string } & Style>

type StringToLazyStyledText = (text: string) => LazyStyledText
type ArrayToLazyStyledText = (
    ...text: (string | LazyStyledText | LazyStyledText[])[]
) => LazyStyledText[]

export type Stylist = (() => Style) &
    StringToLazyStyledText &
    ArrayToLazyStyledText

type BuildStylist = (() => Stylist) &
    StringToLazyStyledText &
    ArrayToLazyStyledText

export type StyleBuilder = {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & BuildStylist

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
export type StyleInitializer = {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & {
    default: BuildStylist
}
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */

// used to stay in sync with BackgroundColor type with Object.defineProperty
function capitalize(value: string): string {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
}

function createStylist(options?: Style) {
    let textColor: Color | undefined = options?.textColor
    let backgroundColor: Color | undefined = options?.backgroundColor
    const fontStyles: FontStyle[] = options?.fontStyles ?? []

    function stylist(): Style
    function stylist(text: string): LazyStyledText
    function stylist(
        ...text: (string | LazyStyledText | LazyStyledText[])[]
    ): LazyStyledText[]
    // eslint-disable-next-line complexity
    function stylist(
        ...text: (string | LazyStyledText | LazyStyledText[])[]
    ): Style | LazyStyledText | LazyStyledText[] {
        const finalStyles = fontStyles.length === 0 ? undefined : fontStyles
        const firstArg = text[0]

        if (firstArg === undefined) {
            return {
                textColor,
                backgroundColor,
                fontStyles: finalStyles,
            }
        }

        if (text.length === 1) {
            if (typeof firstArg !== 'string') {
                // TODO: implement the same cleaning as below
                throw new Error('invalid type, expected a string argument')
            }
            return {
                text: firstArg,
                textColor,
                backgroundColor,
                fontStyles: finalStyles,
            }
        }

        const results: LazyStyledText[] = []
        // TODO: refactor to simplify and clean up
        for (const arg of text) {
            if (typeof arg === 'string') {
                results.push({
                    text: arg,
                    textColor,
                    backgroundColor,
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
                            'invalid type, expected a string argument',
                        )
                    }
                    if (
                        textColor !== undefined &&
                        lazyText.textColor === undefined
                    ) {
                        lazyText.textColor = textColor
                    }
                    if (
                        backgroundColor !== undefined &&
                        lazyText.backgroundColor === undefined
                    ) {
                        lazyText.backgroundColor = backgroundColor
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

    function build(
        ...text: (string | LazyStyledText | LazyStyledText[])[]
    ): LazyStyledText[] | LazyStyledText | Stylist {
        if (text.length > 0) {
            return stylist(...text)
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        defineFontStyle(fontStyle as FontStyle)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        defineFontStyle(fontStyle as FontStyle)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StyleInitializer
})()
