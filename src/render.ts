import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import type { LazyStyledText } from './style.js'
import { colors } from './colors.js'
import { textModifiers, cssFontStyle } from './modifiers.js'

export function stripAnsi(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replaceAll(/\x1b\[\d+m/gu, '')
}

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
                final.push(colors[textColor].text.unset)
            }
            textColor = part.textColor
            if (textColor !== undefined) {
                final.push(colors[textColor].text.set)
            }
        }
        if (part.backgroundColor !== backgroundColor) {
            if (backgroundColor !== undefined) {
                final.push(colors[backgroundColor].background.unset)
            }
            backgroundColor = part.backgroundColor
            if (backgroundColor !== undefined) {
                final.push(colors[backgroundColor].background.set)
            }
        }
        if (part.fontStyles !== fontStyles) {
            if (fontStyles !== undefined) {
                for (const modifier of fontStyles) {
                    final.push(textModifiers[modifier].unset)
                }
            }
            fontStyles = part.fontStyles
            if (fontStyles !== undefined) {
                for (const modifier of fontStyles) {
                    final.push(textModifiers[modifier].set)
                }
            }
        }
        final.push(part.text)
    }

    if (textColor !== undefined) {
        final.push(colors[textColor].text.unset)
    }
    if (backgroundColor !== undefined) {
        final.push(colors[backgroundColor].background.unset)
    }
    if (fontStyles !== undefined) {
        for (const modifier of fontStyles) {
            final.push(textModifiers[modifier].set)
        }
    }
    return final.join('')
}

function css(
    textColor?: Color,
    backgroundColor?: Color,
    fontStyles?: FontStyle[],
): string {
    if (
        textColor === undefined &&
        backgroundColor === undefined &&
        fontStyles === undefined
    ) {
        return ''
    }
    if (
        textColor !== undefined &&
        backgroundColor === undefined &&
        fontStyles === undefined
    ) {
        return `color: ${textColor}`
    }
    if (
        textColor === undefined &&
        backgroundColor !== undefined &&
        fontStyles === undefined
    ) {
        return `background: ${textColor}`
    }

    const cssStyles: string[] = []
    if (textColor !== undefined) {
        cssStyles.push(`color: ${textColor}`)
    }
    if (backgroundColor !== undefined) {
        cssStyles.push(`background: ${backgroundColor}`)
    }
    if (fontStyles !== undefined) {
        for (const modifer of fontStyles) {
            // TODO: must adjust text decoration styles
            cssStyles.push(cssFontStyle[modifer])
        }
    }
    return cssStyles.join('; ')
}

// stripWeb
// pattern below can be used as a base to ensure web styles are stripped
// (?:^|[^%])(%%)*%c

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
            args.push(css(textColor, backgroundColor, fontStyles))
        }
        final.push(part.text.replace(/(%+)c/g, '$1$1c'))
    }

    args[0] = final.join('') // replace with final string
    return args
}
