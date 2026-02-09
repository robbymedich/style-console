import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'
import { indent as indentText, dedent as dedentText } from './spacing.js'

let DEFAULT_INDENT = '    '

export function setDefaultIndent(indent: string): void {
    DEFAULT_INDENT = indent
}

export function getDefaultIndent(): string {
    return DEFAULT_INDENT
}

export function stripStyle(text: string): string {
    return text.replaceAll(/\x1b\[\d+m/ug, '')
}

export function getIndentPrefix(indent: string | number): string {
    return typeof indent === 'string' ? indent : DEFAULT_INDENT.repeat(indent)
}

export type StyleType = 'textColor' | 'backgroundColor' | 'fontStyle' | 'all'

// TODO: calculate setters everytime Style is Modified...
export class Style {
    #fontStyle: FontStyle[] = []
    #textColor?: Color
    #backgroundColor?: Color

    constructor(
        options: {
            textColor?: Color
            backgroundColor?: Color
            fontStyle?: FontStyle[] | FontStyle
        } = {},
    ) {
        if (options.textColor !== undefined) {
            this.textColor(options.textColor)
        }
        if (options.backgroundColor !== undefined) {
            this.backgroundColor(options.backgroundColor)
        }
        if (options.fontStyle !== undefined) {
            const styles = Array.isArray(options.fontStyle)
                ? options.fontStyle
                : [options.fontStyle]
            this.fontStyle(...styles)
        }
    }

    textColor(color: Color): typeof this {
        this.#textColor = color
        return this
    }

    getTextColor(): Color | undefined {
        return this.#textColor
    }

    backgroundColor(color: Color): typeof this {
        this.#backgroundColor = color
        return this
    }

    getBackgroundColor(): Color | undefined {
        return this.#backgroundColor
    }

    fontStyle(...modifiers: FontStyle[]): typeof this {
        if (modifiers.length === 0) {
            throw new Error('font style modifiers cannot be empty')
        }
        this.#fontStyle = []
        for (const modifier of modifiers) {
            this.#fontStyle.push(modifier)
        }
        return this
    }

    getFontStyle(): FontStyle[] {
        return this.#fontStyle
    }

    reset(...options: StyleType[]): typeof this {
        if (options.length === 0) {
            options.push('all')
        }
        for (const styleType of options) {
            if (styleType === 'all') {
                this.#fontStyle = []
                this.#backgroundColor = undefined
                this.#textColor = undefined
            } else if (styleType === 'backgroundColor') {
                this.#backgroundColor = undefined
            } else if (styleType === 'textColor') {
                this.#textColor = undefined
            } else if (styleType === 'fontStyle') {
                this.#fontStyle = []
            } else {
                throw new Error('cannot reset a style type that does not exist')
            }
        }
        return this
    }

    getStyleSetters(): { setStyle: string; unsetStyle: string } {
        const setStyle: string[] = []
        const unsetStyle: string[] = []

        if (this.#textColor !== undefined) {
            const styleOption = colors[this.#textColor].text
            setStyle.push(styleOption.set)
            unsetStyle.push(styleOption.unset)
        }
        if (this.#backgroundColor !== undefined) {
            const styleOption = colors[this.#backgroundColor].background
            setStyle.push(styleOption.set)
            unsetStyle.push(styleOption.unset)
        }
        if (this.#fontStyle.length !== 0) {
            for (const style of this.#fontStyle) {
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

    getStyledText(text: string): string {
        // TODO: check if terminal supports colors
        const { setStyle, unsetStyle } = this.getStyleSetters()
        return `${setStyle}${text}${unsetStyle}`
    }
}

export class LazyStyledText {
    constructor(
        public unmodified: string,
        public style?: Style,
        public indent?: string,
        public dedent: boolean = false,
    ) {}

    getStyledText(): string {
        let text = this.unmodified
        if (this.dedent === true) {
            text = dedentText(text)
        }
        if (this.indent !== undefined) {
            text = indentText(text, this.indent)
        }
        if (this.style !== undefined) {
            text = this.style.getStyledText(text)
        }
        return text
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

    getStyle(): Style {
        return this.#style
    }

    indent(value: string | number): typeof this {
        this.#indent = value
        return this
    }

    getIndent(): string {
        return getIndentPrefix(this.#indent)
    }

    newLine(): typeof this {
        return this.text('\n', { applyIndent: false, applyStyle: false, dedentText: false })
    }

    text(
        value: string,
        options?: {
            applyStyle?: boolean
            style?: Style
            applyIndent?: boolean
            dedentText?: boolean
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
                value,  // unmodified text
                options?.applyStyle === false ? undefined : this.#style,
                calculatedApplyIndent ? this.getIndent() : undefined,
                options?.dedentText,
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
                priorPart.style === currentPart.style &&  // TODO: must make this compare by value not reference
                priorPart.indent === currentPart.indent &&
                priorPart.dedent === currentPart.dedent
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
    textColor: (color: Color): Style => {
        return new Style({ textColor: color })
    },
    backgroundColor: (color: Color): Style => {
        return new Style({ backgroundColor: color })
    },
    fontStyle: (...modifiers: FontStyle[]): Style => {
        return new Style({ fontStyle: modifiers })
    },
    default: (): Style => {
        return new Style()
    },
}
