import type { Color, FontStyle } from './options.js'
import type { StyledText } from './style.js'
import { colorOption, fontStyleOption, colors } from './options.js'

/**
 * Merge `StyledText` arguments into a single flattened list.
 *
 * @param text - StyledText or StyledText[] arguments to flatten and merge.
 * @returns A list with all elements and subelements from the text arguments.
 */
export function concat(...text: (StyledText | StyledText[])[]): StyledText[] {
    // a loop is faster then flat for some reason
    const combined = []
    for (const part of text) {
        if (Array.isArray(part)) {
            for (const subPart of part) {
                combined.push(subPart)
            }
        } else {
            combined.push(part)
        }
    }
    return combined
}

/**
 * Merge `StyledText` arguments into a single flattened list. Add an unstyled
 * or styled separator between outer arguments. The separator is not added to
 * elements of the subarray.
 *
 * @param separator - Unstyled or styled text to use as a separator.
 * @param text - StyledText or StyledText[] arguments to flatten and merge.
 * @returns A list with all elements and subelements from the text arguments.
 */
export function concatWs(
    separator: string | StyledText,
    ...text: (StyledText | StyledText[])[]
): StyledText[] {
    const styledSeparator =
        typeof separator === 'string' ? { text: separator } : separator
    const combined: StyledText[] = []
    let ix = 0
    for (const part of text) {
        ix += 1
        if (Array.isArray(part)) {
            let subIx = 0
            for (const subPart of part) {
                subIx += 1
                combined.push(subPart)
                if (subIx !== part.length) {
                    combined.push(styledSeparator)
                }
            }
        } else {
            combined.push(part)
            if (ix !== text.length) {
                combined.push(styledSeparator)
            }
        }
    }
    return combined
}

/**
 * Removes ANSI escape sequences from a string.
 *
 * @param text - Text that may contain ANSI styling sequences.
 * @returns The plain-text version of `text`.
 */
export function stripAnsi(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replaceAll(/\x1b\[\d+m/gu, '')
}

/**
 * Checks if two font style lists are equal to one another,
 * `lhs === rhs` by value.
 *
 * @param lhs - left hand side
 * @param rhs - right hand side
 */
export function equal(lhs?: FontStyle[], rhs?: FontStyle[]): boolean {
    if (lhs === undefined || rhs === undefined) {
        return lhs === rhs
    }
    if (lhs.length !== rhs.length) {
        return false
    }
    for (let ix = 0; ix < lhs.length; ix++) {
        if (lhs[ix] !== rhs[ix]) {
            return false
        }
    }
    return true
}

/**
 * Renders styled text into a single ANSI-styled string.
 *
 * The renderer only emits escape sequences when the effective style changes
 * between adjacent parts, which keeps the output smaller and easier to read.
 *
 * @param text - A single part or list of parts to render.
 * @returns A string containing ANSI escape sequences.
 */
// eslint-disable-next-line complexity
export function renderAnsi(text: StyledText | StyledText[]): string {
    // performance can be improved by about 40% for non-list arguments if a
    // seprate function cleanly wraps all set and unset style strings to the
    // text at once, not adding this in right now since performance is great
    // as is and this is an edge case
    let textColor: Color | undefined
    let backgroundColor: Color | undefined
    let fontStyles: FontStyle[] | undefined
    let final = ''

    for (const part of Array.isArray(text) ? text : [text]) {
        if (part.textColor !== textColor) {
            if (textColor !== undefined) {
                final += colorOption[textColor].text.unset
            }
            textColor = part.textColor
            if (textColor !== undefined) {
                final += colorOption[textColor].text.set
            }
        }
        if (part.backgroundColor !== backgroundColor) {
            if (backgroundColor !== undefined) {
                final += colorOption[backgroundColor].background.unset
            }
            backgroundColor = part.backgroundColor
            if (backgroundColor !== undefined) {
                final += colorOption[backgroundColor].background.set
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
                        final += fontStyleOption[fontStyle].unset
                    }
                }
            }
            if (fontStyles !== undefined) {
                for (const fontStyle of fontStyles) {
                    // eslint-disable-next-line max-depth
                    if (fontStyleFlags[fontStyle] === true) {
                        final += fontStyleOption[fontStyle as FontStyle].set
                    }
                }
            }
        }
        final += part.text
    }

    if (textColor !== undefined) {
        final += colorOption[textColor].text.unset
    }
    if (backgroundColor !== undefined) {
        final += colorOption[backgroundColor].background.unset
    }
    if (fontStyles !== undefined) {
        for (const fontStyle of fontStyles) {
            final += fontStyleOption[fontStyle].unset
        }
    }
    return final
}

/** Default CSS color theme used when rendering for browser consoles. */
const cssColorTheme: Record<Color, string> = {
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

/**
 * Overrides one or more colors in the browser-console CSS theme.
 *
 * @param options - Partial or full map of color names to CSS color values.
 */
export function setCssColors(options: Record<Color, string>): void {
    for (const [colorName, colorValue] of Object.entries(options)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        if (!colors.includes(colorName as Color)) {
            throw new Error(`invalid color '${colorName}'`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        cssColorTheme[colorName as Color] = colorValue
    }
}

/**
 * Produces a CSS color expression that inverts another CSS color.
 *
 * @param color - Source CSS color.
 * @param dimText - Whether to apply 50% alpha to the result.
 * @returns A CSS `rgb(from ...)` expression.
 */
function invert(color: string, dimText = false): string {
    const dim = dimText ? ' / 0.5' : ''
    return `rgb(from ${color} calc(255 - r) calc(255 - g) calc(255 - b)${dim})`
}

/**
 * Produces a 50%-opacity version of a CSS color.
 *
 * @param color - Source CSS color.
 * @returns A CSS `rgb(from ...)` expression.
 */
function dimColor(color: string): string {
    return `rgb(from ${color} r g b / 0.5)`
}

/**
 * Converts a style triple into a CSS declaration string suitable for `%c`.
 *
 * @param textColor - Foreground color name.
 * @param backgroundColor - Background color name.
 * @param fontStyles - Ordered list of font styles to apply.
 * @returns A semicolon-delimited CSS declaration string.
 */
// eslint-disable-next-line complexity
export function cssStyle(
    textColor?: Color,
    backgroundColor?: Color,
    fontStyles?: FontStyle[],
): string {
    // 'text-decoration' properties, must all be applied together
    let underline = false
    let strikethrough = false
    let doubleunderline = false
    let overlined = false

    // 'color' properties, must all be applied together
    let dim = false
    let hidden = false
    let inverse = false

    const cssStyles = []

    for (const fontStyle of fontStyles ?? []) {
        if (fontStyle === 'bold') {
            cssStyles.push('font-weight: bold')
        } else if (fontStyle === 'italic') {
            cssStyles.push('font-style: italic')
        } else if (fontStyle === 'underline') {
            underline = true
        } else if (fontStyle === 'strikethrough') {
            strikethrough = true
        } else if (fontStyle === 'doubleunderline') {
            doubleunderline = true
        } else if (fontStyle === 'overlined') {
            overlined = true
        } else if (fontStyle === 'dim') {
            dim = true
            hidden = false
        } else if (fontStyle === 'hidden') {
            hidden = true
        } else if (fontStyle === 'inverse') {
            inverse = true
            hidden = false
        } else if (fontStyle === 'framed') {
            cssStyles.push('padding: 1px; border: 1px solid currentColor')
        } else if (fontStyle !== 'blink') {
            // css not supported for blink
            throw new Error(`'${fontStyle}' is not mapped to a CSS style`)
        }
    }

    // set 'color' property
    const currentColor =
        textColor === undefined ? 'currentColor' : cssColorTheme[textColor]
    if (hidden) {
        cssStyles.push('color: rgb(from currentColor r g b / 0)')
    } else if (inverse) {
        const invertColor =
            // eslint-disable-next-line no-nested-ternary
            backgroundColor === undefined
                ? invert(currentColor, dim)
                : dim
                  ? dimColor(cssColorTheme[backgroundColor])
                  : cssColorTheme[backgroundColor]
        cssStyles.push(`color: ${invertColor}`)
    } else if (dim) {
        cssStyles.push(`color: ${dimColor(currentColor)}`)
    } else if (textColor !== undefined) {
        cssStyles.push(`color: ${currentColor}`)
    }

    // set 'background' property
    if (inverse) {
        const invertColor =
            // eslint-disable-next-line no-nested-ternary
            textColor === undefined
                ? invert(currentColor, dim)
                : dim
                  ? dimColor(cssColorTheme[textColor])
                  : cssColorTheme[textColor]
        cssStyles.push(`background: ${invertColor}`)
    } else if (backgroundColor !== undefined) {
        const currentBackground = cssColorTheme[backgroundColor]
        if (dim) {
            cssStyles.push(`background: ${dimColor(currentBackground)}`)
        } else {
            cssStyles.push(`background: ${currentBackground}`)
        }
    }

    // set 'text-decoration' property
    if (doubleunderline) {
        if (strikethrough || overlined) {
            // fall back to underline
            underline = true
            doubleunderline = false
        } else {
            underline = false
        }
    }
    if (underline || strikethrough || doubleunderline || overlined) {
        const textDecoration = []
        if (underline) {
            textDecoration.push('underline')
        }
        if (strikethrough) {
            textDecoration.push('line-through')
        }
        if (overlined) {
            textDecoration.push('overline')
        }
        if (doubleunderline) {
            textDecoration.push('underline double') // must be last to push
        }
        cssStyles.push(`text-decoration: ${textDecoration.join(' ')}`)
    }

    return cssStyles.join('; ')
}

/**
 * Removes browser-console `%c` styling markers while preserving escaped
 * `%` characters.
 *
 * @param text - Text that may contain `%c` console styling markers.
 * @returns The plain-text version of `text`.
 */
export function stripWeb(text: string): string {
    const stylePattern = /(?<p>^|[^%])((?<keep>(%%)+)(?<c>c)?)|(?<strip>%c)/g
    const parts: string[] = []
    let cursor = 0

    for (const reMatch of text.matchAll(stylePattern)) {
        parts.push(text.slice(cursor, reMatch.index))

        const { p, keep, c } = reMatch.groups!
        if (keep !== undefined && keep !== '') {
            parts.push(`${p ?? ''}${'%'.repeat(keep.length / 2)}${c ?? ''}`)
        }
        cursor = reMatch.index + reMatch[0].length
    }

    if (cursor < text.length) {
        parts.push(text.slice(cursor))
    }
    return parts.join('')
}

/**
 * Renders styled text into the argument list expected by the browser's
 * `console.log`.
 *
 * The first element is the formatted string containing `%c` markers. Remaining
 * elements are CSS declarations corresponding to each marker.
 *
 * @param text - A single part or list of parts to render.
 * @returns Arguments ready to spread into `console.log(...renderWeb(text))`.
 */
export function renderWeb(text: StyledText | StyledText[]): string[] {
    let textColor: Color | undefined
    let backgroundColor: Color | undefined
    let fontStyles: FontStyle[] | undefined
    const final: string[] = []
    const args: string[] = [''] // add placeholder for final string

    for (const part of Array.isArray(text) ? text : [text]) {
        if (
            part.textColor !== textColor ||
            part.backgroundColor !== backgroundColor ||
            !equal(part.fontStyles, fontStyles)
        ) {
            textColor = part.textColor
            backgroundColor = part.backgroundColor
            fontStyles = part.fontStyles

            final.push('%c')
            args.push(cssStyle(textColor, backgroundColor, fontStyles))
        }
        final.push(part.text.replace(/(%+)(c)?/g, '$1$1$2'))
    }

    // replace args[0] with final string
    const styledText = final.join('')
    if (args.length === 1) {
        // escape sequences are only handled consistently if styling is used
        // args.length === 1 only happens if no styles were passed to render
        //
        // Safari requires valid CSS to be passed or else it's escape sequence
        // handling still differs from other browers
        args[0] = `%c${styledText}`
        args.push('color: currentColor')
    } else {
        args[0] = styledText
    }
    return args
}

// TODO: create detect and logging options
