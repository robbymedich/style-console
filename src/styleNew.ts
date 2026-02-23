import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
import { colors } from './colors.js'
import { textModifiers } from './modifiers.js'

export type LazyStyledText = {
    text: string
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}

export class Style {
    constructor(
        public textColor?: Color,
        public backgroundColor?: Color,
        public fontStyles?: FontStyle[],
    ) {}

    text(value: string): LazyStyledText {
        return {
            text: value,
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            fontStyles: (this.fontStyles?.length ?? 0) === 0
                ? undefined
                : this.fontStyles,
        }
    }
}

type BackgroundColor = `bg${Capitalize<Color>}`
type StyleBuilder = {
  readonly [key in Color]: StyleBuilder
} & {
  readonly [key in BackgroundColor]: StyleBuilder
} & {
  readonly [key in FontStyle]: StyleBuilder
} & (() => Style)

function capitalize(value: string): string {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
}

export const style = function () {
    let textColor: Color | undefined = undefined
    let backgroundColor: Color | undefined = undefined
    let fontStyles: FontStyle[] = []

    function build(value: string): Style {
        const out = new Style(
            textColor,
            backgroundColor,
            fontStyles.length === 0
                ? undefined
                : fontStyles
        )
        textColor = undefined
        backgroundColor = undefined
        fontStyles = []
        return out
    }

    // Set color options on the builder
    const defineColors = (color: Color) => {
        Object.defineProperty(build, color, {
            get() {
                textColor = color
                return this
            },
            enumerable: true,
        })
        Object.defineProperty(build, `bg${capitalize(color)}`, {
            get() {
                backgroundColor = color
                return this
            },
            enumerable: true,
        })
    }
    for (const color of Object.getOwnPropertyNames(colors)) {
        defineColors(color as Color)
    }

    // Set font style options on the builder
    const defineFontStyle = (modifier: FontStyle) => {
        Object.defineProperty(build, modifier, {
            get() {
                fontStyles.push(modifier)
                return this
            },
            enumerable: true,
        })
    }
    for (const fontStyle of Object.getOwnPropertyNames(textModifiers)) {
        if (fontStyle === 'reset') {
            continue  // reset is a text modifier but not a font style
        }
        defineFontStyle(fontStyle as FontStyle)
    }

    return build as StyleBuilder
}()
