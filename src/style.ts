import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'
import { indent as indentText } from './spacing.js'

let DEFAULT_INDENT = '    '

export function setDefaultIndent(indent: string): void {
    DEFAULT_INDENT = indent
}

export function getDefaultIndent(): string {
    return DEFAULT_INDENT
}

export function getIndentPrefix(indent: string | number): string {
    return typeof indent === 'string' ? indent : DEFAULT_INDENT.repeat(indent)
}

// TODO: calculate setters everytime Style is Modified...
export class Style {
    #style: FontStyle[] = []
    #color?: Color
    #background?: Color
    #reset = false

    constructor(
        textColor?: Color,
        backgroundColor?: Color,
        fontStyle?: FontStyle,
    ) {
        if (textColor !== undefined) {
            this.color(textColor)
        }
        if (backgroundColor !== undefined) {
            this.background(backgroundColor)
        }
        if (fontStyle !== undefined) {
            this.fontStyle(fontStyle)
        }
    }

    color(textColor: Color): typeof this {
        this.#color = textColor
        return this
    }

    getColor(): Color | undefined {
        return this.#color
    }

    background(backgroundColor: Color): typeof this {
        this.#background = backgroundColor
        return this
    }

    getBackground(): Color | undefined {
        return this.#background
    }

    fontStyle(modifier: FontStyle): typeof this {
        this.#style.push(modifier)
        return this
    }

    getFontStyle(): FontStyle[] {
        return this.#reset ? [] : this.#style
    }

    reset(): typeof this {
        this.#reset = true
        return this
    }

    getStyleSetters(): { setStyle: string; unsetStyle: string } {
        // TODO: check if terminal supports colors
        const setStyle: string[] = []
        const unsetStyle: string[] = []

        if (this.#color !== undefined) {
            const styleOption = colors[this.#color].text
            setStyle.push(styleOption.set)
            unsetStyle.push(styleOption.unset)
        }
        if (this.#background !== undefined) {
            const styleOption = colors[this.#background].background
            setStyle.push(styleOption.set)
            unsetStyle.push(styleOption.unset)
        }
        if (!this.#reset && this.#style.length !== 0) {
            for (const style of this.#style) {
                const styleOption = textModifiers[style]
                setStyle.push(styleOption.set)
                unsetStyle.push(styleOption.unset)
            }
        }

        unsetStyle.reverse()
        return {
            setStyle: setStyle.join(''),
            unsetStyle: unsetStyle.join(''),
        }
    }

    getStyledText(text: string, indent: string | number = ''): string {
        const { setStyle, unsetStyle } = this.getStyleSetters()

        const indentPrefix = getIndentPrefix(indent)
        const indentedText = indentText(text, indentPrefix)

        return `${setStyle}${indentedText}${unsetStyle}`
    }
}

export class LazyStyledText {
    constructor(
        public unmodified: string,
        public style?: Style,
        public indent?: string,
    ) {}

    getStyledText(): string {
        if (this.style === undefined) {
            if (this.indent === undefined) {
                return this.unmodified
            }
            return indentText(this.unmodified, this.indent)
        }
        return this.style.getStyledText(this.unmodified, this.indent)
    }
}

export class StyledText {
    #style: Style
    #indent: string | number
    #parts: LazyStyledText[] = []

    constructor(style?: Style, indent?: string | number) {
        this.#style = style === undefined ? new Style() : style
        this.#indent = indent === undefined ? '' : indent
    }

    style(value: Style): typeof this {
        this.#style = value
        return this
    }

    getCurrentStyle(): Style {
        return this.#style
    }

    indent(value: string | number): typeof this {
        this.#indent = value
        return this
    }

    getCurrentIndent(): string {
        return getIndentPrefix(this.#indent)
    }

    newLine(): typeof this {
        return this.text('\n', { applyIndent: false, applyStyle: false })
    }

    text(
        value: string,
        options?: {
            applyStyle?: boolean
            style?: Style
            applyIndent?: boolean
        },
    ): typeof this {
        if (value === '') {
            return this
        }
        let resetStyle: Style | undefined
        if (options?.style !== undefined && options.applyStyle !== false) {
            resetStyle = this.#style
            this.style(options.style)
        }
        let calculatedApplyIndent
        if (options?.applyIndent === undefined) {
            const prior = this.#parts[this.#parts.length - 1]
            calculatedApplyIndent = prior?.unmodified.endsWith('\n') ?? false
        } else {
            calculatedApplyIndent = options.applyIndent
        }

        this.#parts.push(
            new LazyStyledText(
                value,
                options?.applyStyle === false ? undefined : this.#style,
                calculatedApplyIndent ? this.getCurrentIndent() : undefined,
            ),
        )

        if (resetStyle !== undefined) {
            this.style(resetStyle)
        }
        return this
    }

    toString(): string {
        if (this.#parts.length <= 1) {
            const lazyStyled = this.#parts[0]
            if (lazyStyled === undefined) {
                return ''
            }
            return lazyStyled.getStyledText()
        }
        const consolidatedParts: LazyStyledText[] = []

        for (const currentPart of this.#parts) {
            const priorPart = consolidatedParts[consolidatedParts.length - 1]
            if (
                priorPart !== undefined &&
                priorPart.style === currentPart.style &&
                priorPart.indent === currentPart.indent
            ) {
                priorPart.unmodified += currentPart.unmodified
            } else {
                consolidatedParts.push(currentPart)
            }
        }

        return consolidatedParts.map((p) => p.getStyledText()).join('')
    }
}

export const style = {
    color: (textColor: Color): Style => {
        return new Style(textColor)
    },
    background: (backgroundColor: Color): Style => {
        return new Style(undefined, backgroundColor)
    },
    fontStyle: (modifier: FontStyle): Style => {
        return new Style(undefined, undefined, modifier)
    },
    default: (): Style => {
        return new Style()
    },
}
