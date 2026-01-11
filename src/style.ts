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

function getIndentPrefix(indent: string | number): string {
    return typeof indent === 'string' ? indent : DEFAULT_INDENT.repeat(indent)
}

export class Style {
    #style: FontStyle[] = []
    #color?: Color
    #background?: Color
    #reset = false

    constructor(
        textColor?: Color,
        backgroundColor?: Color,
        styleModifier?: FontStyle,
    ) {
        if (textColor !== undefined) {
            this.color(textColor)
        }
        if (backgroundColor !== undefined) {
            this.background(backgroundColor)
        }
        if (styleModifier !== undefined) {
            this.fontStyle(styleModifier)
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
        // check if terminal supports colors
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

class LazyStyledText {
    constructor(
        public unmodified: string,
        public applyStyle: boolean,
        public style: Style,
        public applyIndent: boolean,
        public indent: string | number,
    ) {}

    getStyledText(): string {
        const indentPrefix = this.applyIndent ? this.indent : ''
        if (this.applyStyle) {
            return this.style.getStyledText(this.unmodified, indentPrefix)
        }
        return indentText(this.unmodified, getIndentPrefix(indentPrefix))
    }
}

export class StyledText {
    #style: Style
    #indent: string | number = ''
    #parts: LazyStyledText[] = []

    constructor(style?: Style, text?: string, indent?: string | number) {
        this.#style = style === undefined ? new Style() : style
        if (indent !== undefined) {
            this.indent(indent)
        }
        if (text !== undefined) {
            this.text(text)
        }
    }

    getStyle(): Style {
        return this.#style
    }

    getIndent(): string {
        return getIndentPrefix(this.#indent)
    }

    style(value: Style): typeof this {
        this.#style = value
        return this
    }

    indent(value: string | number): typeof this {
        this.#indent = value
        return this
    }

    newLine(applyStyle = false, applyIndent = true): typeof this {
        let value = '\n'
        if (applyIndent) {
            value += this.getIndent()
        }
        return this.text(value, applyStyle, false)
    }

    text(
        value: string,
        applyStyle = true,
        applyIndent: boolean | undefined = undefined,
    ): typeof this {
        if (value === '') {
            return this
        }
        let calculatedApplyIndent
        if (applyIndent === undefined) {
            calculatedApplyIndent = value.startsWith('\n')
        } else {
            calculatedApplyIndent = applyIndent
        }
        this.#parts.push(
            new LazyStyledText(
                value,
                applyStyle,
                this.#style,
                calculatedApplyIndent,
                this.#indent,
            ),
        )
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
                priorPart.applyStyle === currentPart.applyStyle &&
                priorPart.style === currentPart.style &&
                priorPart.applyIndent === currentPart.applyIndent &&
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
