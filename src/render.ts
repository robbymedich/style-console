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

export function cssStyle(
    textColor?: Color,
    backgroundColor?: Color,
    fontStyles?: FontStyle[],
): string {
    const cssStyles: string[] = []
    if (textColor !== undefined) {
        cssStyles.push(colorOption[textColor].text.css)
    }
    if (backgroundColor !== undefined) {
        cssStyles.push(colorOption[backgroundColor].background.css)
    }
    if (fontStyles !== undefined) {
        for (const fontStyle of fontStyles) {
            // TODO: must adjust text decoration styles
            cssStyles.push(fontStyleOption[fontStyle].css)
        }
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
