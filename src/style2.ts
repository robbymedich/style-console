import type { Color, BackgroundColor, FontStyle } from './options.js'
import { colors, fontStyles, capitalize } from './options.js'

/** A reusable style description without text content. */
/* export */type Style = {
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}

/** Payload that can be rendered as ANSI or browser-console output. */
/* export */type StyledText = Style | string

function* cleanSegments(
    style: Style,
    segements: (string | Iterable<StyledText, void, undefined>)[]
): Generator<StyledText> {
    yield style
    for (const part of segements) {
        if (typeof part === 'string') {
            yield part
        } else {
            for (const subPart of part) {
                if (typeof subPart === 'object') {
                    const mergedStyle = { ...style }
                    if (subPart.textColor !== undefined) {
                        mergedStyle.textColor = subPart.textColor
                    }
                    if (subPart.backgroundColor !== undefined) {
                        mergedStyle.backgroundColor = subPart.backgroundColor
                    }
                    if (subPart.fontStyles !== undefined) {
                        mergedStyle.fontStyles= subPart.fontStyles
                    }
                    yield mergedStyle
                } else {
                    yield subPart
                }
            }
        }
    }
}

export class IterStyledText implements IterableIterator<
    StyledText,
    void,
    undefined
> {
    private segmentIterator: Iterator<StyledText, void, undefined>

    constructor(
        public style: Style,
        private segements: (
            | string
            | Iterable<StyledText, void, undefined>
        )[],
    ) {
        this.segmentIterator = cleanSegments(style, segements)
    }

    next(): IteratorResult<StyledText, void> {
        return this.segmentIterator.next()
    }

    [Symbol.iterator](): IterStyledText {
        return new IterStyledText(this.style, this.segements)
    }
}

function stylist(
    this: Record<'style', Style>,
    ...text: (string | Iterable<StyledText, void, undefined>)[]
): Iterable<StyledText, void, undefined> {
    if (this === undefined) {
        throw new Error("style context not found, 'this' binding incorrect")
    }
    const results: StyledText[] = [this.style]

    if (text.length === 0) {
        return results
    }
    for (const part of text) {
        if (typeof part === 'string') {
            results.push(part)
        } else {
            for (const subPart of part) {
                if (typeof subPart === 'object') {
                    const mergedStyle = { ...this.style }
                    if (subPart.textColor !== undefined) {
                        mergedStyle.textColor = subPart.textColor
                    }
                    if (subPart.backgroundColor !== undefined) {
                        mergedStyle.backgroundColor = subPart.backgroundColor
                    }
                    if (subPart.fontStyles !== undefined) {
                        mergedStyle.fontStyles= subPart.fontStyles
                    }
                    results.push(mergedStyle);
                } else {
                    results.push(subPart)
                }
            }
        }
    }

    return results
}

// Set color options on the builder
for (const color of colors) {
    Object.defineProperty(stylist.prototype, color, {
        get() {
            this.style.textColor = color
            return this
        },
        enumerable: true,
    })
    Object.defineProperty(stylist.prototype, `bg${capitalize(color)}`, {
        get() {
            this.style.backgroundColor = color
            return this
        },
        enumerable: true,
    })
}

// Set font style options on the builder
for (const fontStyle of fontStyles) {
    Object.defineProperty(stylist.prototype, fontStyle, {
        get() {
            if (this.style.fontStyles === undefined) {
                this.style.fontStyles = []
            }
            if (this.style.fontStyles.includes(fontStyle) === false) {
                this.style.fontStyles.push(fontStyle)
            }
            return this
        },
        enumerable: true,
    })
}

/** Callable style function type used by concrete builder instances. */
/* export */type Stylist = typeof stylist

/**
 * Chainable style builder instance.
 *
 * Each color or font-style property returns the same builder shape so calls
 * like `style.red.bold.bgBlue('hello')` remain type-safe.
 */
/* export */type StylistBuilder = {
    readonly [key in Color]: StylistBuilder
} & {
    readonly [key in BackgroundColor]: StylistBuilder
} & {
    readonly [key in FontStyle]: StylistBuilder
} & {
    style: Style
} & Stylist

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/**
 * Public entry point type for the exported `style` object.
 *
 * It can be called with an existing style object, or accessed through dynamic
 * properties like `style.red`, `style.bgBlue`, `style.bold`, and `style.none`.
 */
/* export */type StylistInitializer = {
    readonly [key in Color]: StylistBuilder
} & {
    readonly [key in BackgroundColor]: StylistBuilder
} & {
    readonly [key in FontStyle]: StylistBuilder
} & {
    none: Stylist
} & ((style: Style) => StylistBuilder)
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */

/**
 * Creates a new chainable style builder with the provided initial style state.
 *
 * @param textColor - Initial foreground color.
 * @param backgroundColor - Initial background color.
 * @param fontStyles - Initial font styles.
 * @returns A chainable builder function.
 */
function stylistBuilder(
    textColor?: Color,
    backgroundColor?: Color,
    fontStyles?: FontStyle[],
): StylistBuilder {
    const build = function (...args: Parameters<Stylist>): ReturnType<Stylist> {
        return stylist.call(build, ...args)
    }

    Object.setPrototypeOf(build, stylist.prototype)
    build.style = { textColor, backgroundColor, fontStyles }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StylistBuilder
}

export const style2 = (function () {
    /**
     * Creates a chainable builder from an existing style object.
     *
     * @param style - Initial style state.
     * @returns A new style builder.
     */
    function build(style: Style): StylistBuilder {
        return stylistBuilder(
            style.textColor,
            style.backgroundColor,
            style.fontStyles === undefined ? undefined : [...style.fontStyles],
        )
    }

    // set none option
    Object.defineProperty(build, 'none', {
        get() {
            return stylistBuilder()
        },
        enumerable: true,
    })

    // Set color options on the builder
    for (const color of colors) {
        Object.defineProperty(build, color, {
            get() {
                return stylistBuilder(color)
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                return stylistBuilder(undefined, color)
            },
            enumerable: true,
        })
    }

    // Set font style options on the builder
    for (const fontStyle of fontStyles) {
        Object.defineProperty(build, fontStyle, {
            get() {
                return stylistBuilder(undefined, undefined, [fontStyle])
            },
            enumerable: true,
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StylistInitializer
})()

import { colorOption, fontStyleOption } from './options.js'

/**
 * Checks if two font style lists are equal to one another,
 * `lhs === rhs` by value.
 *
 * @param lhs - left hand side
 * @param rhs - right hand side
 */
export function equal(lhs?: FontStyle[], rhs?: FontStyle[]): boolean {
    if (lhs === rhs) {
        return true
    }
    if (lhs === undefined || rhs === undefined || lhs.length !== rhs.length) {
        return false
    }
    for (let ix = 0; ix < lhs.length; ix++) {
        if (lhs[ix] !== rhs[ix]) {
            return false
        }
    }
    return true
}

export function renderAnsi2(...text: StyledText[][]): string {
    let textColor: Color | undefined
    let backgroundColor: Color | undefined
    let fontStyles: FontStyle[] | undefined
    const final: string[] = []

    for (const segments of text) {
        for (const part of segments) {
            if (typeof part === 'string') {
                final.push(part)
            } else {
                if (part.textColor !== textColor) {
                    if (textColor !== undefined) {
                        final.push(colorOption[textColor].text.unset)
                    }
                    textColor = part.textColor
                    if (textColor !== undefined) {
                        final.push(colorOption[textColor].text.set)
                    }
                }
                if (part.backgroundColor !== backgroundColor) {
                    if (backgroundColor !== undefined) {
                        final.push(colorOption[backgroundColor].background.unset)
                    }
                    backgroundColor = part.backgroundColor
                    if (backgroundColor !== undefined) {
                        final.push(colorOption[backgroundColor].background.set)
                    }
                }
                if (!equal(part.fontStyles, fontStyles)) {
                    const oldStyles = fontStyles
                    fontStyles = part.fontStyles

                    const fontStyleFlags: Partial<Record<FontStyle, boolean>> = {}
                    if (fontStyles !== undefined) {
                        for (const fontStyle of fontStyles) {
                            fontStyleFlags[fontStyle] = true
                        }
                    }
                    if (oldStyles !== undefined) {
                        for (const fontStyle of oldStyles) {
                            // eslint-disable-next-line max-depth
                            if (fontStyleFlags[fontStyle] === true) {
                                fontStyleFlags[fontStyle] = false
                            } else {
                                final.push(fontStyleOption[fontStyle].unset)
                            }
                        }
                    }
                    if (fontStyles !== undefined) {
                        for (const fontStyle of fontStyles) {
                            // eslint-disable-next-line max-depth
                            if (fontStyleFlags[fontStyle] === true) {
                                final.push(fontStyleOption[fontStyle as FontStyle].set)
                            }
                        }
                    }
                }
            }
        }
    }

    if (textColor !== undefined) {
        final.push(colorOption[textColor].text.unset)
    }
    if (backgroundColor !== undefined) {
        final.push(colorOption[backgroundColor].background.unset)
    }
    if (fontStyles !== undefined) {
        for (const fontStyle of fontStyles) {
            final.push(fontStyleOption[fontStyle].unset)
        }
    }
    return final.join('')
}
