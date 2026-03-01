import { expect, test, describe } from 'bun:test'
import { colors, fontStyles } from '../src/options.ts'
import { style } from '../src/style'
import type { LazyStyledText } from '../src/style.ts'

describe('style no arguments', () => {
    test('all text colors', () => {
        for (const color of colors) {
            const styleObject = style[color]()
            expect(styleObject).toEqual({ textColor: color })
        }
    })

    test('all background colors', () => {
        const capitalize = (color: string) => {
            return `${color.slice(0, 1).toUpperCase()}${color.slice(1)}`
        }
        for (const color of colors) {
            const styleObject = style[`bg${capitalize(color)}`]()
            expect(styleObject).toEqual({ backgroundColor: color })
        }
    })

    test('all font modifiers', () => {
        for (const modifier of fontStyles) {
            const styleObject = style[modifier]()
            expect(styleObject).toEqual({ fontStyles: [modifier] })
        }
    })

    test('multiple style options', () => {
        expect(style.bold.red.bgBlueBright.italic()).toEqual({
            textColor: 'red',
            backgroundColor: 'blueBright',
            fontStyles: ['bold', 'italic'],
        })

        expect(style.white.bgBlack()).toEqual({
            textColor: 'white',
            backgroundColor: 'black',
        })
    })

    test('override color multiple times', () => {
        expect(style.red.white.blue()).toEqual({ textColor: 'blue' })
        expect(style.red.bold.white.blue()).toEqual({
            textColor: 'blue',
            fontStyles: ['bold'],
        })
        expect(style.bold.bold.italic.italic()).toEqual({
            fontStyles: ['bold', 'italic'],
        })
    })

    test('no style', () => {
        expect(style.none()).toEqual({})
    })
})

describe('style single argument', () => {
    test('red text', () => {
        expect(style.red('this text is red')).toEqual({
            text: 'this text is red',
            textColor: 'red',
        })
        const red = style.red
        expect(red('this is red')).toEqual({
            text: 'this is red',
            textColor: 'red',
        })
    })

    test('blue, bold, greenBackground', () => {
        expect(style.blue.bold.bgGreen('fancy styling')).toEqual({
            text: 'fancy styling',
            textColor: 'blue',
            backgroundColor: 'green',
            fontStyles: ['bold'],
        })
        const fancy = style.bgGreen.blue.bold
        expect(fancy('more fancy stuff')).toEqual({
            text: 'more fancy stuff',
            textColor: 'blue',
            backgroundColor: 'green',
            fontStyles: ['bold'],
        })
    })

    test('reuse style', () => {
        const bold = style.bold
        expect(bold('hello')).toEqual({ text: 'hello', fontStyles: ['bold'] })
        expect(bold('world')).toEqual({ text: 'world', fontStyles: ['bold'] })
    })

    test('lazy input argument', () => {
        const greenText = style.green('this text is green and bold')
        const expected: LazyStyledText = {
            text: 'this text is green and bold',
            textColor: 'green',
            fontStyles: ['bold'],
        }
        expect(style.bold(greenText)).toEqual(expected)
        expect(style.blue(greenText)).toEqual(expected)
    })

    test('list of strings', () => {})

    test('list of lazy styled text', () => {})

    test('mixed list', () => {})

    test('list of lists', () => {})

    test('no style', () => {
        expect(style.none('hello world')).toEqual({ text: 'hello world' })
        const none = style.none
        expect(none('hello world')).toEqual({ text: 'hello world' })
    })
})
