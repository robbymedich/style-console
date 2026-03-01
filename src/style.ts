import type { Color, FontStyle } from './options.js'
import { colors, fontStyles } from './options.js'

type Prettify<T> = { [key in keyof T]: T[key] } & {}
export type Style = {
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}
export type LazyStyledText = Prettify<{ text: string } & Style>

function stylist(): Style
function stylist(text: string | LazyStyledText): LazyStyledText
function stylist(
    ...text: (string | LazyStyledText | LazyStyledText[])[]
): LazyStyledText[]
function stylist(
    this: Style,
    ...text: (string | LazyStyledText | LazyStyledText[])[]
): Style | LazyStyledText | LazyStyledText[] {
    if (this === undefined) {
        throw new Error("style context not found, 'this' binding incorrect")
    }
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
        if (this.textColor !== undefined && part.textColor === undefined) {
            part.textColor = this.textColor
        }
        if (
            this.backgroundColor !== undefined &&
            part.backgroundColor === undefined
        ) {
            part.backgroundColor = this.backgroundColor
        }
        if (finalStyles !== undefined && part.fontStyles === undefined) {
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

// Set color options on the builder
for (const color of colors) {
    Object.defineProperty(stylist.prototype, color, {
        get() {
            this.textColor = color
            return this
        },
        enumerable: true,
    })
    Object.defineProperty(stylist.prototype, `bg${capitalize(color)}`, {
        get() {
            this.backgroundColor = color
            return this
        },
        enumerable: true,
    })
}

// Set font style options on the builder
for (const fontStyle of fontStyles) {
    Object.defineProperty(stylist.prototype, fontStyle, {
        get() {
            if (this.fontStyles === undefined) {
                this.fontStyles = []
            }
            if (this.fontStyles.includes(fontStyle) === false) {
                this.fontStyles.push(fontStyle)
            }
            return this
        },
        enumerable: true,
    })
}

type BackgroundColor = `bg${Capitalize<Color>}`

export type Stylist = typeof stylist

export type StyleBuilder = Style & {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & Stylist

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
export type StyleInitializer = {
    readonly [key in Color]: StyleBuilder
} & {
    readonly [key in BackgroundColor]: StyleBuilder
} & {
    readonly [key in FontStyle]: StyleBuilder
} & {
    none: Stylist
}
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */

function styleBuilder(
    textColor?: Color,
    backgroundColor?: Color,
    fontStyles?: FontStyle[],
): StyleBuilder {
    const build = function (...args: Parameters<Stylist>): ReturnType<Stylist> {
        return stylist.call(build, ...args)
    }

    Object.setPrototypeOf(build, stylist.prototype)
    build.textColor = textColor
    build.backgroundColor = backgroundColor
    build.fontStyles = fontStyles

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StyleBuilder
}

export const style = (function () {
    const build = {}

    // set none option
    Object.defineProperty(build, 'none', {
        get() {
            return styleBuilder()
        },
        enumerable: true,
    })

    // Set color options on the builder
    for (const color of colors) {
        Object.defineProperty(build, color, {
            get() {
                return styleBuilder(color)
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                return styleBuilder(undefined, color)
            },
            enumerable: true,
        })
    }

    // Set font style options on the builder
    for (const fontStyle of fontStyles) {
        Object.defineProperty(build, fontStyle, {
            get() {
                return styleBuilder(undefined, undefined, [fontStyle])
            },
            enumerable: true,
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StyleInitializer
})()
