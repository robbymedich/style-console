import type { Color } from './colors.js'
import type { FontStyle } from './modifiers.js'
// import { colors } from './colors.js'
// import { textModifiers } from './modifiers.js'

export type LazyStyledText = {
    text: string
    textColor?: Color
    backgroundColor?: Color
    fontStyles?: FontStyle[]
}

export class Style {
    #textColor?: Color
    #backgroundColor?: Color
    #fontStyles: FontStyle[] = []

    get black(): typeof this {
        this.#textColor = 'black'
        return this
    }

    get white(): typeof this {
        this.#textColor = 'white'
        return this
    }

    get grey(): typeof this {
        this.#textColor = 'grey'
        return this
    }

    get greyBright(): typeof this {
        this.#textColor = 'greyBright'
        return this
    }

    get blue(): typeof this {
        this.#textColor = 'blue'
        return this
    }

    get blueBright(): typeof this {
        this.#textColor = 'blueBright'
        return this
    }

    get cyan(): typeof this {
        this.#textColor = 'cyan'
        return this
    }

    get cyanBright(): typeof this {
        this.#textColor = 'cyanBright'
        return this
    }

    get green(): typeof this {
        this.#textColor = 'green'
        return this
    }

    get greenBright(): typeof this {
        this.#textColor = 'greenBright'
        return this
    }

    get magenta(): typeof this {
        this.#textColor = 'magenta'
        return this
    }

    get magentaBright(): typeof this {
        this.#textColor = 'magentaBright'
        return this
    }

    get red(): typeof this {
        this.#textColor = 'red'
        return this
    }

    get redBright(): typeof this {
        this.#textColor = 'redBright'
        return this
    }

    get yellow(): typeof this {
        this.#textColor = 'yellow'
        return this
    }

    get yellowBright(): typeof this {
        this.#textColor = 'yellowBright'
        return this
    }

    get bgBlack(): typeof this {
        this.#backgroundColor = 'black'
        return this
    }

    get bgWhite(): typeof this {
        this.#backgroundColor = 'white'
        return this
    }

    get bgGrey(): typeof this {
        this.#backgroundColor = 'grey'
        return this
    }

    get bgGreyBright(): typeof this {
        this.#backgroundColor = 'greyBright'
        return this
    }

    get bgBlue(): typeof this {
        this.#backgroundColor = 'blue'
        return this
    }

    get bgBlueBright(): typeof this {
        this.#backgroundColor = 'blueBright'
        return this
    }

    get bgCyan(): typeof this {
        this.#backgroundColor = 'cyan'
        return this
    }

    get bgCyanBright(): typeof this {
        this.#backgroundColor = 'cyanBright'
        return this
    }

    get bgGreen(): typeof this {
        this.#backgroundColor = 'green'
        return this
    }

    get bgGreenBright(): typeof this {
        this.#backgroundColor = 'greenBright'
        return this
    }

    get bgMagenta(): typeof this {
        this.#backgroundColor = 'magenta'
        return this
    }

    get bgMagentaBright(): typeof this {
        this.#backgroundColor = 'magentaBright'
        return this
    }

    get bgRed(): typeof this {
        this.#backgroundColor = 'red'
        return this
    }

    get bgRedBright(): typeof this {
        this.#backgroundColor = 'redBright'
        return this
    }

    get bgYellow(): typeof this {
        this.#backgroundColor = 'yellow'
        return this
    }

    get bgYellowBright(): typeof this {
        this.#backgroundColor = 'yellowBright'
        return this
    }

    get bold(): typeof this {
        this.#fontStyles.push('bold')
        return this
    }

    get dim(): typeof this {
        this.#fontStyles.push('dim')
        return this
    }

    get italic(): typeof this {
        this.#fontStyles.push('italic')
        return this
    }

    get underline(): typeof this {
        this.#fontStyles.push('underline')
        return this
    }

    get strikethrough(): typeof this {
        this.#fontStyles.push('strikethrough')
        return this
    }

    get blink(): typeof this {
        this.#fontStyles.push('blink')
        return this
    }

    get hidden(): typeof this {
        this.#fontStyles.push('hidden')
        return this
    }

    get inverse(): typeof this {
        this.#fontStyles.push('inverse')
        return this
    }

    get doubleunderline(): typeof this {
        this.#fontStyles.push('doubleunderline')
        return this
    }

    get framed(): typeof this {
        this.#fontStyles.push('framed')
        return this
    }

    get overlined(): typeof this {
        this.#fontStyles.push('overlined')
        return this
    }

    text(value: string): LazyStyledText {
        const lazyStyledText = {
            text: value,
            textColor: this.#textColor,
            backgroundColor: this.#backgroundColor,
            fontStyles: this.#fontStyles.length === 0
                ? undefined
                : this.#fontStyles,
        }
        this.#textColor = undefined
        this.#backgroundColor = undefined
        this.#fontStyles = []
        return lazyStyledText
    }
}

export const style = new Style()

const t = style.bold.red.text('hello')
