import { expect, test, describe } from 'bun:test'
import { colors, fontStyles } from '../src/options.ts'
import { style } from '../src/style'
import type { StyledText } from '../src/style.ts'

// perform unsafe casting to test edge cases people will do even though it
// doesn't align to the proper types
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion  */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
    test('style from Style', () => {
        expect(style({})()).toEqual(style.none())
        expect(
            style({
                textColor: 'blue',
                backgroundColor: 'black',
                fontStyles: ['bold', 'italic'],
            })(),
        ).toEqual(style.blue.bgBlack.bold.italic())
        const bold = style.bold
        expect(style(bold)()).toEqual(bold())
        expect(style(bold).underline()).toEqual(style.bold.underline())
        expect(bold()).toEqual({ fontStyles: ['bold'] })
    })

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

    test('styled text input argument', () => {
        const greenText = style.green('this text is green and bold')
        const expected: StyledText = {
            text: 'this text is green and bold',
            textColor: 'green',
            fontStyles: ['bold'],
        }
        expect(style.bold(greenText)).toEqual(expected)
        expect(style.blue(greenText)).toEqual(expected)
    })

    test('list of strings', () => {
        expect(style.red(['one', 'two', 'three'] as any[])).toEqual([
            { text: 'one', textColor: 'red' },
            { text: 'two', textColor: 'red' },
            { text: 'three', textColor: 'red' },
        ])

        expect(style.none(['one', 'two', 'three'] as any[])).toEqual([
            { text: 'one' },
            { text: 'two' },
            { text: 'three' },
        ])
    })

    test('list of styled text', () => {
        expect(
            style.red([{ text: 'one' }, { text: 'two' }, { text: 'three' }]),
        ).toEqual([
            { text: 'one', textColor: 'red' },
            { text: 'two', textColor: 'red' },
            { text: 'three', textColor: 'red' },
        ])

        expect(
            style.bgBlue([
                { text: 'one', textColor: 'red' },
                { text: 'two', textColor: 'red' },
                { text: 'three', textColor: 'red' },
            ]),
        ).toEqual([
            { text: 'one', textColor: 'red', backgroundColor: 'blue' },
            { text: 'two', textColor: 'red', backgroundColor: 'blue' },
            { text: 'three', textColor: 'red', backgroundColor: 'blue' },
        ])
    })

    test('mixed list', () => {
        expect(
            style.bgBlue([
                'one',
                { text: 'two' },
                { text: 'three', textColor: 'red' },
            ] as any[]),
        ).toEqual([
            { text: 'one', backgroundColor: 'blue' },
            { text: 'two', backgroundColor: 'blue' },
            { text: 'three', textColor: 'red', backgroundColor: 'blue' },
        ])
    })

    test('no style', () => {
        expect(style.none('hello world')).toEqual({ text: 'hello world' })
        const none = style.none
        expect(none('hello world')).toEqual({ text: 'hello world' })
    })
})

describe('style multiple arguments', () => {
    test('multiple string', () => {
        expect(style.red('one', 'two', 'three')).toEqual([
            { text: 'one', textColor: 'red' },
            { text: 'two', textColor: 'red' },
            { text: 'three', textColor: 'red' },
        ])

        expect(style.none('one', 'two', 'three')).toEqual([
            { text: 'one' },
            { text: 'two' },
            { text: 'three' },
        ])
    })

    test('multiple styled text', () => {
        expect(
            style.red({ text: 'one' }, { text: 'two' }, { text: 'three' }),
        ).toEqual([
            { text: 'one', textColor: 'red' },
            { text: 'two', textColor: 'red' },
            { text: 'three', textColor: 'red' },
        ])

        expect(
            style.bgBlue([
                { text: 'one', textColor: 'red' },
                { text: 'two', textColor: 'red' },
                { text: 'three', textColor: 'red' },
            ]),
        ).toEqual([
            { text: 'one', textColor: 'red', backgroundColor: 'blue' },
            { text: 'two', textColor: 'red', backgroundColor: 'blue' },
            { text: 'three', textColor: 'red', backgroundColor: 'blue' },
        ])
    })

    test('multiple mixed', () => {
        expect(
            style.bgBlue(
                'one',
                { text: 'two' },
                { text: 'three', textColor: 'red' },
            ),
        ).toEqual([
            { text: 'one', backgroundColor: 'blue' },
            { text: 'two', backgroundColor: 'blue' },
            { text: 'three', textColor: 'red', backgroundColor: 'blue' },
        ])
    })

    test('no style', () => {
        expect(style.none('hello', 'world')).toEqual([
            { text: 'hello' },
            { text: 'world' },
        ])
        const none = style.none
        expect(none('hello', 'world')).toEqual([
            { text: 'hello' },
            { text: 'world' },
        ])
    })

    test('multiple mixed lists', () => {
        expect(
            style.red(['one'] as any[], [
                { text: 'two' },
                { text: 'three', backgroundColor: 'green' },
            ]),
        ).toEqual([
            { text: 'one', textColor: 'red' },
            { text: 'two', textColor: 'red' },
            { text: 'three', textColor: 'red', backgroundColor: 'green' },
        ])
    })
})

describe('style nested arguments', () => {
    test('nested colors', () => {
        expect(
            style.red('red', style.blue('blue'), style.bgCyan('redBgCyan')),
        ).toEqual([
            { text: 'red', textColor: 'red' },
            { text: 'blue', textColor: 'blue' },
            { text: 'redBgCyan', textColor: 'red', backgroundColor: 'cyan' },
        ])
    })

    test('nested backgrounds', () => {
        expect(
            style.bgRed('red', style.bgBlue('blue'), style.cyan('redBgCyan')),
        ).toEqual([
            { text: 'red', backgroundColor: 'red' },
            { text: 'blue', backgroundColor: 'blue' },
            { text: 'redBgCyan', textColor: 'cyan', backgroundColor: 'red' },
        ])
    })

    test('nested font-styles', () => {
        expect(
            style.bold('bold', style.blue('blue'), style.italic('italic')),
        ).toEqual([
            { text: 'bold', fontStyles: ['bold'] },
            { text: 'blue', textColor: 'blue', fontStyles: ['bold'] },
            { text: 'italic', fontStyles: ['italic'] },
        ])
    })
})
