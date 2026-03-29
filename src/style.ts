import type { Color, BackgroundColor, FontStyle } from './options.js'
import { colors, fontStyles, capitalize } from './options.js'

type Prettify<T> = { [key in keyof T]: T[key] } & {}

/** A reusable style description without text content. */
export type Style = {
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}

/** Payload that can be rendered as ANSI or browser-console output. */
export type StyledText = Prettify<{ text: string } & Style>

/**
 * Applies the current builder style to a single part.
 *
 * Existing values on `StyledText` objects are preserved and only
 * missing style fields are filled in.
 */
function clean(currentStyle: Style, part: string | StyledText): StyledText {
    if (typeof part === 'string') {
        return {
            text: part,
            textColor: currentStyle.textColor,
            backgroundColor: currentStyle.backgroundColor,
            fontStyles: currentStyle.fontStyles,
        }
    }
    if (currentStyle.textColor !== undefined && part.textColor === undefined) {
        part.textColor = currentStyle.textColor
    }
    if (
        currentStyle.backgroundColor !== undefined &&
        part.backgroundColor === undefined
    ) {
        part.backgroundColor = currentStyle.backgroundColor
    }
    if (
        currentStyle.fontStyles !== undefined &&
        part.fontStyles === undefined
    ) {
        part.fontStyles = currentStyle.fontStyles
    }
    return part
}

/** Main function to build StyledText from an input Style */
function stylist(
    currentStyle: Style,
    text: (string | StyledText | StyledText[])[],
): Style | StyledText | StyledText[] {
    // no arguments
    const firstArg = text[0]
    if (firstArg === undefined) {
        return {
            textColor: currentStyle.textColor,
            backgroundColor: currentStyle.backgroundColor,
            fontStyles: currentStyle.fontStyles,
        }
    }

    // single non-array argument
    if (text.length === 1 && !Array.isArray(firstArg)) {
        return clean(currentStyle, firstArg)
    }

    // multi-argument
    const results: StyledText[] = []
    for (const part of text) {
        if (Array.isArray(part)) {
            for (const subPart of part) {
                const cleanedPart = clean(currentStyle, subPart)
                results.push(cleanedPart)
            }
        } else {
            const cleanedPart = clean(currentStyle, part)
            results.push(cleanedPart)
        }
    }
    return results
}

// Store prototype as a variable to improve performance
const stylistPrototype = Object.getPrototypeOf(stylist)

// Set color options on the builder
for (const color of colors) {
    Object.defineProperty(stylistPrototype, color, {
        get() {
            this.textColor = color
            return this
        },
        enumerable: true,
    })
    Object.defineProperty(stylistPrototype, `bg${capitalize(color)}`, {
        get() {
            this.backgroundColor = color
            return this
        },
        enumerable: true,
    })
}

// Set font style options on the builder
for (const fontStyle of fontStyles) {
    Object.defineProperty(stylistPrototype, fontStyle, {
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

/** Callable style function type used by concrete builder instances. */
export type Stylist = {
    /**
     * Callable used to build `StyledText` from `string` or other
     * `StyledText` objects. If a `StyledText` argument is used, the existing
     * text color, background color and font styles will not be overridden but
     * missing styles will be added.
     *
     * Calling without any arguments returns the linked `Style` object used to
     * lazily style text.
     *
     * Calling with a list or multiple arguments returns `StyledText`[].
     */
    (): Style
    /**
     * Create a `StyledText` object from a string or another `StyledText`
     * object. If a `StyledText` argument is used, the existing text color,
     * background color and font styles will not be overridden but missing
     * styles will be added.
     *
     * @param text - input `string` or `StyledText` to style.
     * @returns `StyledText` object with the applied styles
     */
    (text: string | StyledText): StyledText
    /**
     * Create a list of `StyledText` objects from `string`(s) or other
     * `StyledText` objects. If a `StyledText` argument is used, the existing
     * text color, background color and font styles will not be overridden but
     * missing styles will be added.
     *
     * @param text - list of `string` or `StyledText` arguments to style.
     * @returns `StyledText[]` with applied styles to all input arguments
     */
    (...text: (string | StyledText | StyledText[])[]): StyledText[]
}

/**
 * Chainable style builder instance.
 *
 * Each color or font-style property returns the same builder shape so calls
 * like `style.red.bold.bgBlue('hello')` remain type-safe.
 */
export type StylistBuilder = Style & {
    readonly [key in Color]: StylistBuilder
} & {
    readonly [key in BackgroundColor]: StylistBuilder
} & {
    readonly [key in FontStyle]: StylistBuilder
} & Stylist

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/**
 * Public entry point type for the exported `style` object.
 *
 * It can be called with an existing style object, or accessed through dynamic
 * properties like `style.red`, `style.bgBlue`, `style.bold`, and `style.none`.
 */
export type StylistInitializer = {
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
    function build(): Style
    function build(text: string | StyledText): StyledText
    function build(
        ...text: (string | StyledText | StyledText[])[]
    ): StyledText[]
    function build(
        ...text: (string | StyledText | StyledText[])[]
    ): Style | StyledText | StyledText[] {
        return stylist(build, text)
    }
    Object.setPrototypeOf(build, stylistPrototype)

    build.textColor = textColor
    build.backgroundColor = backgroundColor
    build.fontStyles = fontStyles

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return build as StylistBuilder
}

/**
 * Global style factory used to create chainable style builders
 *
 * Examples:
 * - `style.red.bold('hello')`
 * - `style.none('plain text')`
 * - `style({ textColor: 'red' }).underline('hello')`
 * - `const savedStyle = style.bgRed.bold`
 * - `style(savedStyle).white('bold with a red background and white text')`
 */
export const style = (function () {
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
