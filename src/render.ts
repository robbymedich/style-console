import type { Color, FontStyle } from './options.js'
import type { LazyStyledText } from './style.js'
import { colorOption, fontStyleOption } from './options.js'

export function stripAnsi(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replaceAll(/\x1b\[\d+m/gu, '')
}

// eslint-disable-next-line complexity
export function renderAnsi(
    text: (LazyStyledText | string)[] | LazyStyledText | string,
): string {
    const allParts = Array.isArray(text) ? text : [text]
    let textColor: Color | undefined
    let backgroundColor: Color | undefined
    let fontStyles: FontStyle[] | undefined
    const final: string[] = []

    for (const rawPart of allParts) {
        const part = typeof rawPart === 'string' ? { text: rawPart } : rawPart
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
        if (part.fontStyles !== fontStyles) {
            if (fontStyles !== undefined) {
                for (const fontStyle of fontStyles) {
                    final.push(fontStyleOption[fontStyle].unset)
                }
            }
            fontStyles = part.fontStyles
            if (fontStyles !== undefined) {
                for (const fontStyle of fontStyles) {
                    final.push(fontStyleOption[fontStyle].set)
                }
            }
        }
        final.push(part.text)
    }

    if (textColor !== undefined) {
        final.push(colorOption[textColor].text.unset)
    }
    if (backgroundColor !== undefined) {
        final.push(colorOption[backgroundColor].background.unset)
    }
    if (fontStyles !== undefined) {
        for (const fontStyle of fontStyles) {
            final.push(fontStyleOption[fontStyle].set)
        }
    }
    return final.join('')
}

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

export function setCssColors(options: Record<Color, string>): void {
    for (const [colorName, colorValue] of Object.entries(options)) {
        cssColorTheme[colorName as Color] = colorValue
    }
}

function invert(color: string, dimText = false): string {
    const dim = dimText ? ' / 0.5' : ''
    return `rgb(from ${color} calc(255 - r) calc(255 - g) calc(255 - b)${dim})`
}

function dimColor(color: string): string {
    return `rgb(from ${color} r g b / 0.5)`
}

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
        } else if (fontStyle === 'blink') {
            // css not supported for blink must push empty for browsers to
            // consistently handle escape sequences
            cssStyles.push('')
        } else {
            throw new Error(`'${fontStyle}' is not mapped to a CSS style`)
        }
    }

    // set 'color' property
    const currentColor = textColor === undefined
        ? 'currentColor'
        : cssColorTheme[textColor]
    if (hidden === true) {
        cssStyles.push('color: rgb(from currentColor r g b / 0)')
    } else if (inverse === true) {
        const invertColor = backgroundColor === undefined ?
            invert(currentColor, dim) :
            (dim ? dimColor(cssColorTheme[backgroundColor]) : cssColorTheme[backgroundColor])
        cssStyles.push(`color: ${invertColor}`)
    } else if (dim === true) {
        cssStyles.push(`color: ${dimColor(currentColor)}`)
    } else if (textColor !== undefined) {
        cssStyles.push(`color: ${currentColor}`)
    }

    // set 'background' property
    if (inverse === true) {
        const invertColor = textColor === undefined ?
            invert(currentColor, dim) :
            (dim ? dimColor(cssColorTheme[textColor]) : cssColorTheme[textColor])
        cssStyles.push(`background: ${invertColor}`)
    } else if (backgroundColor !== undefined) {
        const currentBackground = cssColorTheme[backgroundColor]
        if (dim === true) {
            cssStyles.push(`background: ${dimColor(currentBackground)}`)
        } else {
            cssStyles.push(`background: ${currentBackground}`)
        }
    }

    // set 'text-decoration' property
    if (doubleunderline === true) {
        if (strikethrough === true || overlined === true) {
            // fall back to underline
            underline = true
            doubleunderline = false
        } else {
            underline = false
        }
    }
    if (
        underline === true ||
        strikethrough === true ||
        doubleunderline === true ||
        overlined === true
    ) {
        const textDecoration = []
        if (underline === true) {
            textDecoration.push('underline')
        }
        if (strikethrough === true) {
            textDecoration.push('line-through')
        }
        if (overlined === true) {
            textDecoration.push('overline')
        }
        if (doubleunderline === true) {
            textDecoration.push('underline double')  // must be last to push
        }
        cssStyles.push(`text-decoration: ${textDecoration.join(' ')}`)
    }

    return cssStyles.join('; ')
}

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

export function renderWeb(
    text: (LazyStyledText | string)[] | LazyStyledText | string,
): string[] {
    const allParts = Array.isArray(text) ? text : [text]
    let textColor: Color | undefined
    let backgroundColor: Color | undefined
    let fontStyles: FontStyle[] | undefined
    const final: string[] = []
    const args: string[] = [''] // add placeholder for final string

    for (const rawPart of allParts) {
        const part = typeof rawPart === 'string' ? { text: rawPart } : rawPart
        if (
            part.textColor !== textColor ||
            part.backgroundColor !== backgroundColor ||
            part.fontStyles !== fontStyles
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
